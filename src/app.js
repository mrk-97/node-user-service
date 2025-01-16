// src/app.js
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger/swagger');
const userRoutes = require('./routes/user.routes');
const { initializeDatabase } = require('./config/database');
const { router: healthRoutes, setStartupComplete } = require('./health/health.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check routes
app.use('/health', healthRoutes);

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// API routes
app.use('/api', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Mark startup as complete
    setStartupComplete();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
      console.log('Health check endpoints:');
      console.log(`- Startup: http://localhost:${PORT}/health/startup`);
      console.log(`- Liveness: http://localhost:${PORT}/health/liveness`);
      console.log(`- Readiness: http://localhost:${PORT}/health/readiness`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    setStartupComplete(error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;