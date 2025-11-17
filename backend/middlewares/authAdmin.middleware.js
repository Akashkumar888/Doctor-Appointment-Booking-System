import jwt from "jsonwebtoken";

export const authAdmin = async (req, res, next) => {
  try {
    // 1️⃣ Validate authorization header
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

    // 4️⃣ Check admin role
    if (!decoded.role || decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access only",
      });
    }

    // 5️⃣ Attach admin payload
    req.admin = decoded;

    next();
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
