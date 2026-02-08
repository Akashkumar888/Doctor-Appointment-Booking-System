import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  try {
    // 🔒 Validate env variables
    if (
      !process.env.CLOUDINARY_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_SECRET_KEY
    ) {
      throw new Error("❌ Cloudinary environment variables are missing");
    }

    // 🔧 Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    // ✅ Success log
    console.log("✅ Cloudinary connected successfully");
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
    process.exit(1); // ⛔ Stop server if Cloudinary fails
  }
};

export default connectCloudinary;
