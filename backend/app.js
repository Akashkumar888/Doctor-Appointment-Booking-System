import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.config.js';
import userRouter from './routes/user.route.js';
import connectCloudinary from './configs/cloudinary.config.js';
import adminRouter from './routes/admin.route.js';
// app config
const app=express();

// middleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors()); // it allow to connect frontend to backend

// database connection
connectDB();
connectCloudinary();

// test route
app.get("/", (req, res) => {
  res.send('Server is Live!');
});

// all /api/routes will go here later
// api endpoints
app.use("/api/user",userRouter);
app.use("/api/admin",adminRouter);
// localhost:4000/api/admin used 

export default app;