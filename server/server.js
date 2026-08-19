import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { handleStripeWebhook } from "./controllers/user/payment.controller.js";
import { initOrderChangeStream } from "./listeners/orderListeners.js";

// centralized route index:
import apiRoutes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

// global core middleware :
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// primary api router health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});

app.use("/api", apiRoutes);

// error handling middleware :
app.use(notFound);
app.use(errorHandler);

// server Lifecycle Management
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    // initialize mongoDB change streams / background workers
    initOrderChangeStream();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`\n👋 ${signal} received. Closing HTTP server...`);
      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (err) => {
      console.error("💥 Unhandled Rejection! Shutting down...", err);
      shutdown("UNHANDLED_REJECTION");
    });
  } catch (error) {
    console.error("❌ Fatal Error during startup:", error);
    process.exit(1);
  }
};

startServer();
