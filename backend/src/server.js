// Express app setup
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prRoutes = require('./routes/pr.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/pr', prRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎩 Welcome to Tux PR Review API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/pr/health',
      fetchPR: 'POST /api/pr/fetch'
    }
  });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🎩 TUX PR Review API');
  console.log('='.repeat(60));
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`✅ GitHub Token: ${process.env.GITHUB_TOKEN ? '✓ Configured' : '✗ Missing'}`);
  console.log('\n📍 Available endpoints:');
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/api/pr/health`);
  console.log(`   POST http://localhost:${PORT}/api/pr/fetch`);
  console.log('\n' + '='.repeat(60) + '\n');
});