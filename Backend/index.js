import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './route/user.route.js';




const app = express()
dotenv.config();
const PORT= process.env.PORT || 5001;

const port = 5002
const URI = process.env.MONGODB_URI;

try {
  mongoose.connect(URI).then(console.log("MongoDB Connected"));}
  
catch (error) {
  console.log("MongoDB  error:", error);

  
}

app.use("/user", userRoutes);




app.listen(PORT, () => {
  console.log(`Example app listening on Port ${port}`)  
})
   