import jwt from "jsonwebtoken";

export const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin.id || "admin-fixed",
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
};
