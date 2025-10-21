
import jwt from 'jsonwebtoken'
import blackListModel from '../models/blackListToken.model.js';


// admin authentication middleware 

export const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }

    const token = authHeader.split(" ")[1];
    const isBlackListed = await blackListModel.findOne({ token });
    if (isBlackListed) {
      return res.status(401).json({ success: false, message: "Token expired/blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "admin") {
      return res.status(401).json({ success: false, message: "Invalid admin token" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
