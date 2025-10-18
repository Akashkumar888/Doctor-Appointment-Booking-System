import doctorModel from "../models/doctor.model.js";
import { v2 as cloudinary } from "cloudinary";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointment.model.js";
import userModel from "../models/user.model.js";
import blackListModel from "../models/blackListToken.model.js";

// api for adding doctor
export const addDoctor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // empty nhi hai mtlb error hai
      return res
        .status(401)
        .json({
          success: false,
          message: errors.array().map((err) => err.msg),
        });
    }

    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    // checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // check if doctor exists
    const isAlreadyDoctorExist = await doctorModel.findOne({ email });
    if (isAlreadyDoctorExist) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor already exists" });
    }

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // just pass raw password, Mongoose will hash automatically:
    // create user (password gets hashed automatically by pre('save'))
    const doctorData = {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      image: imageUrl,
      date: Date.now(),
    };

    const newDoctor = await doctorModel.create(doctorData);

    res
      .status(201)
      .json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api for the admin login

export const loginAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // empty nhi hai mtlb error hai
      return res
        .status(401)
        .json({
          success: false,
          message: errors.array().map((err) => err.msg),
        });
    }
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    if (password !== process.env.ADMIN_PASSWORD) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res
      .status(201)
      .json({ success: true, message: "Login successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api user logout
export const logoutAdmin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Token Not found" });
    // Add to blacklist if not already exists
    await blackListModel.updateOne(
  { token },
  { $setOnInsert: { token, createdAt: new Date() } },
  { upsert: true }
);

    res.json({ success: true, message: "Logged out successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all doctors list for admin panel

export const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.status(201).json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all appointment for admin panel
export const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = (await appointmentModel.find({})).reverse(); //all the appointments
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get appointment cancelled for admin panel
export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId); // all the appointment

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    }); // all the appointment
    // releasing doctor slots
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res
      .status(200)
      .json({ success: true, message: "Appointment cancelled successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel

export const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}); // all doctors
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.status(200).json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
