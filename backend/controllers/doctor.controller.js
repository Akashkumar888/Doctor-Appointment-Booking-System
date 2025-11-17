import appointmentModel from "../models/appointment.model.js";
import doctorModel from "../models/doctor.model.js";
import { validationResult } from "express-validator";
import { generateDoctorToken } from "../utils/generateDoctorToken.util.js";

// ================= CHANGE AVAILABILITY ==================
export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctor = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !doctor.available,
    });

    res.json({ success: true, message: "Availability updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET DOCTOR LIST ==================
export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({})
      .select(["-password", "-email"]);

    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= LOGIN DOCTOR (FIXED TOKEN) ==================
export const loginDoctor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg),
      });

    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email }).select("+password");
    if (!doctor)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = await doctor.comparePassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });

    // 🟢 CORRECT — GENERATE DOCTOR JWT TOKEN
    const token = generateDoctorToken(doctor);

    res.json({
      success: true,
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DOCTOR APPOINTMENTS ==================
export const appointmentsDoctor = async (req, res) => {
  try {
    const doctorId = req.doctor._id;

    const appointments = (
      await appointmentModel.find({ docId: doctorId })
    ).reverse();

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= MARK COMPLETED ==================
export const appointmentComplete = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.docId.toString() !== doctorId.toString())
      return res.json({ success: false, message: "Not allowed" });

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    res.json({ success: true, message: "Appointment completed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= CANCEL APPOINTMENT ==================
export const appointmentCancel = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.docId.toString() !== doctorId.toString())
      return res.json({ success: false, message: "Not allowed" });

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DOCTOR DASHBOARD ==================
export const doctorDashboard = async (req, res) => {
  try {
    const doctorId = req.doctor._id;

    const appointments = await appointmentModel.find({ docId: doctorId });

    let earnings = 0;
    let patients = new Set();

    appointments.forEach((a) => {
      if (a.payment || a.isCompleted) earnings += a.amount;
      patients.add(a.userId.toString());
    });

    res.json({
      success: true,
      dashData: {
        earnings,
        patients: patients.size,
        appointments: appointments.length,
        latestAppointments: appointments.reverse().slice(0, 5),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DOCTOR PROFILE ==================
export const doctorProfile = async (req, res) => {
  res.json({
    success: true,
    profileData: req.doctor,
  });
};

// ================= UPDATE PROFILE ==================
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const { fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(doctorId, {
      fees,
      address,
      available,
    });

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
