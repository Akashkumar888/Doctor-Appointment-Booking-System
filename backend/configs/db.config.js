
import mongoose from "mongoose";

const connectDB=async()=>{
  try {
    // MongoDB connection events
    mongoose.connection.on("connected",()=>{
      console.log("✅ Database connected successfully.");
    })
    mongoose.connection.on("error",(error)=>{
      console.log("❌ Database connection error:",error)
    });
    mongoose.connection.on("disconnected",()=>{
      console.log("⚠️ Database disconnected.");
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/Doctor-Appointment-Booking`);
  } catch (error) {
    console.log("Database connection failed.");
    process.exit(1);
  }
};

export default connectDB;