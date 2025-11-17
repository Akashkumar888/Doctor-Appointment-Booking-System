import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import doctorModel from "../models/doctor.model.js";
import appointmentModel from "../models/appointment.model.js";
import { v2 as cloudinary } from "cloudinary";
import razorpayInstance from "../configs/razorpay.config.js";
import { generateUserToken } from "../utils/generateUserToken.util.js";

// ================= REGISTER ==================
export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array().map((e) => e.msg) });
    }

    const { name, email, password } = req.body;

    const alreadyExists = await userModel.findOne({ email });
    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const userData = await userModel.create({ name, email, password });

    // 🟢 Generate NEW JWT TOKEN (role=user)
    const token = generateUserToken(userData);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= LOGIN ==================
export const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array().map((e) => e.msg) });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User does not exist" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });

    // 🟢 Generate NEW JWT TOKEN
    const token = generateUserToken(user);

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

// ================= GET PROFILE ==================
export const getProfile = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= UPDATE PROFILE ==================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    await userModel.findByIdAndUpdate(
      userId,
      { name, phone, address: JSON.parse(address), dob, gender },
      { new: true }
    );

    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path);
      await userModel.findByIdAndUpdate(userId, { image: upload.secure_url });
    }

    res.json({ success: true, message: "Profile updated successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= BOOK APPOINTMENT ==================
export const bookAppointment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData)
      return res.status(404).json({ success: false, message: "Doctor not found" });

    if (!docData.available)
      return res
        .status(400)
        .json({ success: false, message: "Doctor not available" });

    let slots = docData.slots_booked;

    if (!slots[slotDate]) slots[slotDate] = [];
    if (slots[slotDate].includes(slotTime))
      return res.json({ success: false, message: "Slot not available" });

    slots[slotDate].push(slotTime);

    const user = await userModel.findById(userId).select("-password");

    await appointmentModel.create({
      userId,
      docId,
      userData: user,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    });

    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slots });

    res.json({ success: true, message: "Appointment booked successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= LIST APPOINTMENTS ==================
export const listAppointment = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.user._id });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= CANCEL APPOINTMENT ==================
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });

    if (appointment.userId.toString() !== req.user._id.toString())
      return res.json({ success: false, message: "Unauthorized" });

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    res.json({ success: true, message: "Appointment cancelled!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= PAYMENT ORDER ==================
const USD_TO_INR = 83;

const convertToPaise = (amount, currency) =>
  currency === "$"
    ? Math.round(amount * USD_TO_INR * 100)
    : Math.round(amount * 100);

export const createOrder = async (req, res) => {
  try {
    const { appointmentId, currencySymbol } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    const order = await razorpayInstance.orders.create({
      amount: convertToPaise(appointment.amount, currencySymbol),
      currency: "INR",
      receipt: appointmentId,
    });

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const info = await razorpayInstance.orders.fetch(req.body.razorpay_order_id);

    if (info.status === "paid") {
      await appointmentModel.findByIdAndUpdate(info.receipt, {
        payment: true,
      });
    }

    res.json({
      success: info.status === "paid",
      message: info.status === "paid" ? "Payment Success!" : "Payment Failed",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
