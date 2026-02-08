import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.config.js";
import userRouter from "./routes/user.route.js";
import connectCloudinary from "./configs/cloudinary.config.js";
import adminRouter from "./routes/admin.route.js";
import doctorRouter from "./routes/doctor.route.js";

const app = express();
const PORT = process.env.PORT || 4000;

/* ✅ CORS (Express 5 safe) */
app.use(
  cors({
    origin: true, // allow all origins (Render + Vercel)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Services */
connectDB();
connectCloudinary();

/* Health check */
app.get("/", (req, res) => {
  res.send("🚀 Server is Live!");
});

/* Routes */
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

/* Start */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
