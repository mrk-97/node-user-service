// health.routes.js
const express = require('express');
const { getPool } = require('../config/database');
const router = express.Router();

// Track application startup state
let isStartupComplete = false;
let startupError = null;

// Set startup complete
function setStartupComplete(error = null) {
  isStartupComplete = !error;
  startupError = error;
}

/**
 * @swagger
 * /health/startup:
 *   get:
 *     summary: Startup probe endpoint
 *     tags: [Health]
 *     description: Checks if the application has completed its startup sequence
 *     responses:
 *       200:
 *         description: Application startup completed successfully
 *       503:
 *         description: Application is still starting up or startup failed
 */
router.get('/startup', (req, res) => {
  if (isStartupComplete) {
    res.status(200).json({
      status: 'up',
      message: 'Application startup completed'
    });
  } else {
    res.status(503).json({
      status: 'down',
      message: startupError || 'Application is starting up',
    });
  }
});

/**
 * @swagger
 * /health/liveness:
 *   get:
 *     summary: Liveness probe endpoint
 *     tags: [Health]
 *     description: Checks if the application is running and responding to requests
 *     responses:
 *       200:
 *         description: Application is running
 *       503:
 *         description: Application is not running properly
 */
router.get('/liveness', (req, res) => {
  // Check if the event loop is not blocked
  const startTime = process.hrtime();
  const timeoutThreshold = 1000; // 1 second

  setTimeout(() => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const responseTime = seconds * 1000 + nanoseconds / 1000000;

    if (responseTime > timeoutThreshold) {
      res.status(503).json({
        status: 'down',
        message: 'Event loop is blocked',
        responseTime
      });
    } else {
      res.status(200).json({
        status: 'up',
        message: 'Application is running',
        responseTime
      });
    }
  }, 0);
});

/**
 * @swagger
 * /health/readiness:
 *   get:
 *     summary: Readiness probe endpoint
 *     tags: [Health]
 *     description: Checks if the application is ready to handle requests
 *     responses:
 *       200:
 *         description: Application is ready to handle requests
 *       503:
 *         description: Application is not ready to handle requests
 */
router.get('/readiness', async (req, res) => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    
    // Test database query
    await connection.query('SELECT 1');
    connection.release();

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryThreshold = 1024 * 1024 * 1024; // 1GB

    if (memoryUsage.heapUsed > memoryThreshold) {
      res.status(503).json({
        status: 'down',
        message: 'Memory usage exceeds threshold',
        memoryUsage
      });
      return;
    }

    res.status(200).json({
      status: 'up',
      message: 'Application is ready',
      checks: {
        database: 'connected',
        memory: {
          status: 'healthy',
          used: memoryUsage.heapUsed,
          total: memoryUsage.heapTotal
        }
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'down',
      message: 'Application is not ready',
      error: error.message
    });
  }
});

module.exports = {
  router,
  setStartupComplete
};
