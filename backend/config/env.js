const dotenv = require("dotenv");
const path = require("path");

// Load .env only for local development
if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: path.join(__dirname, "../.env"),
  });
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};