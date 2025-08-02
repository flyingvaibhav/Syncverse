import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
const app = express()
dotenv.config();
const PORT= process.env.PORT || 5001;

const port = 5002
const URI = process.env.MONGODB_URI;

try {
  mongoose.connect(URI)
  .then(console.log("MongoDB Connected "));
}
catch (error) {
  console.log("MongoDB connection error:", error);

  
}






app.listen(PORT, () => {
  console.log(`Example app listening on port ${port}`)
})
   