import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URI = process.env.MONGODB_URI;

if (!URI) {
  console.error("MONGODB_URI is not set in .env file");
  console.log("Please create a .env file with your MongoDB connection string:");
  console.log("MONGODB_URI=mongodb://localhost:27017/syncverse");
  process.exit(1);
}

console.log("Testing MongoDB connection...");
console.log("Connection string:", URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials

mongoose.connect(URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log("✅ MongoDB connection successful!");
  console.log("Database:", mongoose.connection.name);
  console.log("Host:", mongoose.connection.host);
  console.log("Port:", mongoose.connection.port);
  process.exit(0);
})
.catch((error) => {
  console.error("❌ MongoDB connection failed:", error.message);
  console.log("\nTroubleshooting tips:");
  console.log("1. Make sure MongoDB is running");
  console.log("2. Check if the connection string is correct");
  console.log("3. Verify network connectivity");
  console.log("4. Check if MongoDB requires authentication");
  process.exit(1);
});
