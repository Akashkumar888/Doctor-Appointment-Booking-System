import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.config.js";
import userRouter from "./routes/user.route.js";
import connectCloudinary from "./configs/cloudinary.config.js";
import adminRouter from "./routes/admin.route.js";
import doctorRouter from "./routes/doctor.route.js";
// app config
const app = express();

const PORT = process.env.PORT || 4000;

// ✅ Step 1: Add simple working CORS
// PERMISSIVE MODE for development/deployment
// Set specific FRONTEND_URL and ADMIN_URL in production for security
app.use(
  cors({
    origin: true, // Allow all origins (Vercel/Render have dynamic URLs)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // ✅ IMPORTANT (JWT only)
  }),
);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
connectDB();
connectCloudinary();

// test route
app.get("/", (req, res) => {
  res.send("Server is Live!");
});

// debug/env route (safe - does NOT expose secrets)
app.get("/api/debug/env", (req, res) => {
  try {
    res.json({
      success: true,
      jwtSecretSet: !!process.env.JWT_SECRET,
      mongodbUriSet: !!process.env.MONGODB_URI,
      adminEmailSet: !!process.env.ADMIN_EMAIL,
      cloudinaryConfigured: !!(
        process.env.CLOUDINARY_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_SECRET_KEY
      ),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// all /api/routes will go here later
// api endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
// localhost:4000/api/admin used

app.listen(PORT, () => {
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});
