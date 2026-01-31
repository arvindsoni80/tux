/**
 * Test script to fetch and display PR data
 * Usage: node test-pr.js <PR_URL>
 * Example: node test-pr.js https://github.com/arvindsoni80/skit/pull/1
 */

require('dotenv').config();
const githubService = require('./src/services/github.service');

const testPR = async () => {
  const prUrl = process.argv[2];

  if (!prUrl) {
    console.error('\n❌ Error: Please provide a PR URL');
    console.log('\nUsage:');
    console.log('  node test-pr.js <PR_URL>');
    console.log('\nExample:');
    console.log('  node test-pr.js https://github.com/arvindsoni80/skit/pull/1');
    console.log('  node test-pr.js facebook/react/pull/28000');
    process.exit(1);
  }

  try {
    const data = await githubService.fetchCompletePR(prUrl);
    
    // Print a sample of the data structure
    console.log('\n📊 Data Structure:');
    console.log('================\n');
    
    console.log('PR Info:');
    console.log(JSON.stringify(data.pr, null, 2));
    
    console.log('\n\nFirst File (sample):');
    if (data.files.length > 0) {
      const firstFile = data.files[0];
      console.log(JSON.stringify({
        filename: firstFile.filename,
        status: firstFile.status,
        additions: firstFile.additions,
        deletions: firstFile.deletions,
        patch: firstFile.patch.substring(0, 200) + '...' // Just first 200 chars
      }, null, 2));
    }
    
    console.log('\n\nFirst Review Comment (sample):');
    if (data.reviewComments.length > 0) {
      console.log(JSON.stringify(data.reviewComments[0], null, 2));
    }
    
    console.log('\n\n✅ Test completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
};

testPR();