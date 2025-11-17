
import jwt from "jsonwebtoken";

export const generateDoctorToken = (doctor) => {
  return jwt.sign(
    {
      id: doctor._id,
      role: "doctor",
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};
