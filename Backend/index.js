import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production vs Development environment
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = isProduction 
  ? [
      "https://syncverse-wdz7.onrender.com", // Your actual Render domain
      "https://syncverse-wdz7.onrender.com", // Also include without www
    ]
  : [
      "http://localhost:3000",
      "http://localhost:3001", 
      "http://localhost:3002",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002",
      "http://127.0.0.1:5173",
    ];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      cb(null, allowedOrigins.includes(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const PORT = Number(process.env.PORT || 5004);
const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

// health
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Database health check
app.get("/db-health", (_req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  
  res.json({ 
    status: statusMap[dbStatus] || "unknown",
    readyState: dbStatus,
    isConnected: dbStatus === 1
  });
});

// API routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// Serve static files from the React build folder in production
if (isProduction) {
  // Serve static files from the React build
  app.use(express.static(path.join(__dirname, "Frontend", "dist")));
  
  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    // Don't serve React for API routes
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: 'API route not found' });
    }
    
    // Serve React app for all other routes
    res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
  });
  
  console.log("Production mode: Serving React frontend");
} else {
  console.log("Development mode: React frontend not served");
}

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  if (err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkError') {
    return res.status(503).json({ error: "Database connection error. Please try again." });
  }
  
  if (err.name === 'MongoError' && err.code === 50) {
    return res.status(503).json({ error: "Database operation timed out. Please try again." });
  }
  
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Improved MongoDB connection with better options
const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(URI, options);
    console.log("Connected to MongoDB successfully");
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Process error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);
  if (isProduction) {
    console.log(`📱 React frontend will be served from: ${path.join(__dirname, "Frontend", "dist")}`);
  }
});