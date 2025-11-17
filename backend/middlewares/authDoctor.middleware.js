import jwt from "jsonwebtoken";
import doctorModel from "../models/doctor.model.js";

export const authDoctor = async (req, res, next) => {
  try {
    // 1️⃣ Check Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token missing",
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 4️⃣ Doctor ID from token
    const doctorId = decoded._id || decoded.id;
    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: "Doctor ID missing in token",
      });
    }

    // 5️⃣ Fetch doctor from DB
    const doctor = await doctorModel.findById(doctorId).select("-password");
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // 6️⃣ Attach doctor object to request
    req.doctor = doctor;

    next();
  } catch (error) {
    console.error("AUTH DOCTOR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
