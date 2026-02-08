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
app.use(
  cors({
    origin: (origin, callback) => {
      // For production: accept any origin (Vercel/Render deployments have unpredictable URLs)
      // For security-conscious deployments, set FRONTEND_URL and ADMIN_URL env vars
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
        process.env.FRONTEND_URL_2,
        "https://doctor-appointment-booking-system-f-gamma.vercel.app",
        "https://doctor-appointment-booking-system-frontend-bvsgdjcnn.vercel.app",
      ].filter(Boolean);

      // Allow Postman / server-to-server / no origin
      if (!origin) return callback(null, true);

      // If specific origins configured, enforce them; otherwise allow any
      if (allowedOrigins.length > 0) {
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          console.warn("Blocked CORS origin:", origin);
          return callback(new Error("Not allowed by CORS"));
        }
      } else {
        // No specific origins configured - allow any (useful for initial deploy)
        console.log(
          "CORS: Allowing origin:",
          origin,
          "(no specific origins configured)",
        );
        return callback(null, true);
      }
    },
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
