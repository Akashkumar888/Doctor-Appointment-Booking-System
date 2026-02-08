import jwt from "jsonwebtoken";

export const generateUserToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not set. Set JWT_SECRET in environment variables.",
    );
  }
  return jwt.sign(
    {
      id: user._id,
      role: "user",
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
};
