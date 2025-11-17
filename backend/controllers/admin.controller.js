import doctorModel from "../models/doctor.model.js";
import { v2 as cloudinary } from "cloudinary";
import { validationResult } from "express-validator";
import appointmentModel from "../models/appointment.model.js";
import userModel from "../models/user.model.js";
import { generateAdminToken } from "../utils/generateAdminToken.util.js";

// ================= ADD DOCTOR ==================
export const addDoctor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg),
      });

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
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    const exists = await doctorModel.findOne({ email });
    if (exists)
      return res.json({
        success: false,
        message: "Doctor already exists",
      });

    const upload = await cloudinary.uploader.upload(req.file.path);

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
      image: upload.secure_url,
      date: Date.now(),
    };

    await doctorModel.create(doctorData);

    res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= LOGIN ADMIN (FIXED TOKEN) ==================
export const loginAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg),
      });

    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    // 🟢 CORRECT ROLE-BASED TOKEN
    const token = generateAdminToken({ email });

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL DOCTORS ==================
export const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL APPOINTMENTS ==================
export const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = (await appointmentModel.find({})).reverse();
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= CANCEL APPOINTMENT ==================
export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointment;
    const doctor = await doctorModel.findById(docId);

    doctor.slots_booked[slotDate] = doctor.slots_booked[slotDate].filter(
      (s) => s !== slotTime
    );

    await doctor.save();

    res.json({
      success: true,
      message: "Appointment cancelled successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= ADMIN DASHBOARD ==================
export const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    res.json({
      success: true,
      dashData: {
        doctors: doctors.length,
        patients: users.length,
        appointments: appointments.length,
        latestAppointments: appointments.reverse().slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
