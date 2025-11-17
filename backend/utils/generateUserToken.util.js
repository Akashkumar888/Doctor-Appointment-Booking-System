
import jwt from "jsonwebtoken";

export const generateUserToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: "user",
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};
