import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const authUser = async (req, res, next) => {
  try {
    // 1️⃣ Extract token (Cookie or Bearer Header)
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    // 2️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 3️⃣ Get User ID
    const userId = decoded._id || decoded.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token missing user id",
      });
    }

    // 4️⃣ Fetch user (password removed)
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 5️⃣ Attach user to req
    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
