// GitHub API integration
const axios = require('axios');

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.token = process.env.GITHUB_TOKEN;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` })
      }
    });
  }

  /**
   * Parse PR URL to extract owner, repo, and PR number
   * Supports formats:
   * - https://github.com/owner/repo/pull/123
   * - github.com/owner/repo/pull/123
   * - owner/repo/pull/123
   * - owner/repo#123
   */
  parsePRUrl(url) {
    // Remove protocol and trailing slashes
    const cleaned = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Match: owner/repo/pull/number or owner/repo#number
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/,
      /^([^\/]+)\/([^\/]+)\/pull\/(\d+)/,
      /^([^\/]+)\/([^\/]+)#(\d+)/
    ];

    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2],
          prNumber: parseInt(match[3])
        };
      }
    }

    throw new Error('Invalid PR URL format. Use: https://github.com/owner/repo/pull/123');
  }

  /**
   * Fetch PR details
   */
  async fetchPR(owner, repo, prNumber) {
    try {
      console.log(`\n🔍 Fetching PR #${prNumber} from ${owner}/${repo}...`);
      
      const response = await this.client.get(`/repos/${owner}/${repo}/pulls/${prNumber}`);
      
      const pr = {
        number: response.data.number,
        title: response.data.title,
        description: response.data.body || 'No description provided',
        state: response.data.state,
        author: response.data.user.login,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at,
        htmlUrl: response.data.html_url,
        additions: response.data.additions,
        deletions: response.data.deletions,
        changedFiles: response.data.changed_files,
        baseBranch: response.data.base.ref,
        headBranch: response.data.head.ref
      };

      console.log('\n✅ PR Details:');
      console.log(`   Title: ${pr.title}`);
      console.log(`   Author: ${pr.author}`);
      console.log(`   State: ${pr.state}`);
      console.log(`   Changes: +${pr.additions} -${pr.deletions} across ${pr.changedFiles} files`);
      
      return pr;
    } catch (error) {
      this.handleError(error, 'fetching PR');
    }
  }

  /**
   * Fetch PR files and diffs
   */
  async fetchPRFiles(owner, repo, prNumber) {
    try {
      console.log(`\n📄 Fetching files for PR #${prNumber}...`);
      
      const response = await this.client.get(`/repos/${owner}/${repo}/pulls/${prNumber}/files`);
      
      const files = response.data.map(file => ({
        filename: file.filename,
        status: file.status, // 'added', 'removed', 'modified', 'renamed'
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch || '', // The actual diff
        blobUrl: file.blob_url,
        rawUrl: file.raw_url,
        previousFilename: file.previous_filename // For renamed files
      }));

      console.log(`\n✅ Found ${files.length} files:`);
      files.forEach((file, idx) => {
        console.log(`   ${idx + 1}. ${file.filename} (${file.status}) +${file.additions} -${file.deletions}`);
      });

      return files;
    } catch (error) {
      this.handleError(error, 'fetching PR files');
    }
  }

  /**
   * Fetch PR comments (review comments on specific lines)
   */
  async fetchPRComments(owner, repo, prNumber) {
    try {
      console.log(`\n💬 Fetching comments for PR #${prNumber}...`);
      
      const response = await this.client.get(`/repos/${owner}/${repo}/pulls/${prNumber}/comments`);
      
      const comments = response.data.map(comment => ({
        id: comment.id,
        author: comment.user.login,
        body: comment.body,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        path: comment.path, // File the comment is on
        line: comment.line, // Line number (may be null for outdated comments)
        originalLine: comment.original_line,
        diffHunk: comment.diff_hunk, // The diff context
        position: comment.position,
        inReplyTo: comment.in_reply_to_id
      }));

      console.log(`\n✅ Found ${comments.length} review comments`);
      
      // Group by author for summary
      const byAuthor = comments.reduce((acc, comment) => {
        acc[comment.author] = (acc[comment.author] || 0) + 1;
        return acc;
      }, {});

      console.log('   Comments by author:');
      Object.entries(byAuthor).forEach(([author, count]) => {
        console.log(`   - ${author}: ${count} comment${count > 1 ? 's' : ''}`);
      });

      return comments;
    } catch (error) {
      this.handleError(error, 'fetching PR comments');
    }
  }

  /**
   * Fetch PR issue comments (general comments on the PR, not on specific lines)
   */
  async fetchPRIssueComments(owner, repo, prNumber) {
    try {
      console.log(`\n💭 Fetching issue comments for PR #${prNumber}...`);
      
      const response = await this.client.get(`/repos/${owner}/${repo}/issues/${prNumber}/comments`);
      
      const comments = response.data.map(comment => ({
        id: comment.id,
        author: comment.user.login,
        body: comment.body,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at
      }));

      console.log(`✅ Found ${comments.length} general comments`);
      
      return comments;
    } catch (error) {
      this.handleError(error, 'fetching issue comments');
    }
  }

  /**
   * Fetch complete PR data (PR + files + all comments)
   */
  async fetchCompletePR(prUrl) {
    try {
      const { owner, repo, prNumber } = this.parsePRUrl(prUrl);
      
      console.log('\n' + '='.repeat(60));
      console.log(`🎩 TUX - Fetching PR Data`);
      console.log('='.repeat(60));

      // Fetch all data in parallel for speed
      const [pr, files, reviewComments, issueComments] = await Promise.all([
        this.fetchPR(owner, repo, prNumber),
        this.fetchPRFiles(owner, repo, prNumber),
        this.fetchPRComments(owner, repo, prNumber),
        this.fetchPRIssueComments(owner, repo, prNumber)
      ]);

      const result = {
        pr,
        files,
        reviewComments,
        issueComments,
        metadata: {
          owner,
          repo,
          prNumber,
          fetchedAt: new Date().toISOString()
        }
      };

      console.log('\n' + '='.repeat(60));
      console.log('✨ Fetch Complete!');
      console.log('='.repeat(60));
      console.log(`\nTotal: ${files.length} files, ${reviewComments.length + issueComments.length} comments\n`);

      return result;
    } catch (error) {
      if (error.message.includes('Invalid PR URL')) {
        throw error;
      }
      this.handleError(error, 'fetching complete PR data');
    }
  }

  /**
   * Error handler
   */
  handleError(error, context) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Unknown error';
      
      console.error(`\n❌ Error ${context}:`);
      console.error(`   Status: ${status}`);
      console.error(`   Message: ${message}`);
      
      if (status === 401) {
        console.error('\n💡 Tip: Check your GITHUB_TOKEN in .env file');
      } else if (status === 403) {
        console.error('\n💡 Tip: Rate limit exceeded. Wait or check your token.');
      } else if (status === 404) {
        console.error('\n💡 Tip: PR not found. Check owner/repo/number are correct.');
      }
      
      throw new Error(`GitHub API Error: ${status} - ${message}`);
    } else {
      console.error(`\n❌ Error ${context}:`, error.message);
      throw error;
    }
  }
}

module.exports = new GitHubService();