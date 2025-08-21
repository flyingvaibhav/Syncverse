import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './route/user.route.js';



const app = express()
dotenv.config();

app.use(express.json());

app.use(cors());

const PORT= process.env.PORT || 5001;
const URI = process.env.MONGODB_URI;

mongoose.connect(URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to MongoDB:", error);
});

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})
   