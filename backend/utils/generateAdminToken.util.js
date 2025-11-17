
import jwt from "jsonwebtoken";

export const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};
