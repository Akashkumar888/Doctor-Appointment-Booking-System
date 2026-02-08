import jwt from "jsonwebtoken";

export const generateAdminToken = (admin) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not set. Set JWT_SECRET in environment variables.",
    );
  }
  return jwt.sign(
    {
      id: admin.id || "admin-fixed",
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
};
