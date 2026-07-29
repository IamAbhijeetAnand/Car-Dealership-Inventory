const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

// Connect to MongoDB Atlas
connectDB();

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `[Server] Car Dealership API running in ${env.NODE_ENV} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] Error: ${err.message}`);
  server.close(() => process.exit(1));
});
