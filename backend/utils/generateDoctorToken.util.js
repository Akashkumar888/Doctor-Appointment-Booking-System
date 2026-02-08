import jwt from "jsonwebtoken";

export const generateDoctorToken = (doctor) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not set. Set JWT_SECRET in environment variables.",
    );
  }
  return jwt.sign(
    {
      id: doctor._id || doctor.id,
      role: "doctor",
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
};
