// PR controller logic
const githubService = require('../services/github.service');

class PRController {
  /**
   * Fetch complete PR data
   * POST /api/pr/fetch
   * Body: { prUrl: "https://github.com/owner/repo/pull/123" }
   */
  async fetchPR(req, res, next) {
    try {
      const { prUrl } = req.body;

      if (!prUrl) {
        return res.status(400).json({
          success: false,
          error: 'prUrl is required'
        });
      }

      const data = await githubService.fetchCompletePR(prUrl);

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Health check endpoint
   * GET /api/pr/health
   */
  async health(req, res) {
    res.json({
      success: true,
      message: 'Tux PR API is running',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new PRController();