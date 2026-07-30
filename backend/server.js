const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

const PORT = process.env.PORT || env.PORT || 5000;

let server;

// Start Server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express Server
    server = app.listen(PORT, () => {
      console.log(
        `[Server] Car Dealership API running in ${env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("[Startup Error]", error);
    process.exit(1);
  }
};

startServer();

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error("[Unhandled Rejection]", err);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("[Uncaught Exception]", err);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("[SIGTERM] Shutting down gracefully...");

  if (server) {
    server.close(() => {
      console.log("[Server] Closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});