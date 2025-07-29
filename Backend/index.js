import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const PORT= process.env.PORT || 5001;
const app = express()
const port = 5002


app.listen(PORT, () => {
  console.log(`Example app listening on port ${port}`)
})
