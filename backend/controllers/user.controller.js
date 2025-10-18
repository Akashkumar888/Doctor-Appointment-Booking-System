import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import blackListModel from '../models/blackListToken.model.js'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctor.model.js";
import appointmentModel from "../models/appointment.model.js";
import razorpayInstance from "../configs/razorpay.config.js";

// api to register to user
export const registerUser=async(req,res)=>{
  try {
    // validate inputs
  const errors = validationResult(req);
  if(!errors.isEmpty()) { // empty nhi hai mtlb error hai
    return res.status(400).json({ success: false, errors: errors.array().map(err => err.msg)});
  }

    const {name,email,password}=req.body;

    // if(!name || !email ||!password){
    //   return res.status(400).json({ success: false, message: "All fields are required " });
    // }  no need because validationResult already check

    // check if user exists
    const isAlreadyUserExist = await userModel.findOne({email});
    if (isAlreadyUserExist) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // just pass raw password, Mongoose will hash automatically:  
    // create user (password gets hashed automatically by pre('save'))
    const userData=await userModel.create({
      name,
      email,
      password
    });
     
      // generate token
    const token=userData.generateAuthToken();

    //     Register → issue token so the user is instantly logged in after signup.
    res.status(201).json({
      success:true,
      message:'User created Successfully!',token});

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}



// api to login user  
export const loginUser=async(req,res)=>{
  try {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({success:false,errors:errors.array().map(err => err.msg)});
    }
    
    const {email,password}=req.body;
    const user=await userModel.findOne({email}).select("+password"); // here password needed
    if(!user)return res.status(401).json({success:false,message:'User does not exist'});
    const isMatch=await user.comparePassword(password);
    if(!isMatch)return res.status(401).json({success:false,message:'Incorrect Password'});
    
    const token=user.generateAuthToken();
// Login → issue token so an existing user gets a new session.
// This is why both need token generation. It’s not duplication, it’s two different scenarios leading to authentication.

// After comparing, you can remove it before sending the response:
    const safeUser=user.toObject();
    delete safeUser.password;
    // user:safeUser, // send safe data only

   res.json({
    success:true,
    message:'Login successfully!',
    token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}



// api to get the user data 
export const getProfile=async(req,res)=>{
  try {
    res.status(201).json({success:true,user:req.user});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}



// api user logout 
export const logoutUser=async(req,res)=>{
  try {
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({success:false,message:'Not authorized'}); 
    }
    const token=authHeader.split(" ")[1];
    if(!token)return res.status(401).json({success:false,message:"Token Not found"});
    // Add to blacklist if not already exists
    await blackListModel.updateOne(
  { token },
  { $setOnInsert: { token, createdAt: new Date() } },
  { upsert: true }
);
    res.json({ success: true, message: "Logged out successfully!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}


export const updateProfile=async(req,res)=>{
  try {
    const userId = req.user._id; // ✅ comes from token authUser middleware, not body
    const {name,phone,address,dob,gender}=req.body;
    const imageFile=req.file;
    // validate input
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    
    if(!name || !phone  || !dob ||!gender){
      return res.status(401).json({success:false,message:"Data Missing"})
    }

    // find and update user
     await userModel.findByIdAndUpdate(
      userId,
      { name, phone, address:JSON.parse(address), dob, gender },
      { new: true } // returns updated document
    );
    
    if(imageFile){
     // upload image ot cloudinary
     const imageUpload=await cloudinary.uploader.upload(imageFile.path,{
      resource_type:'image'
     });
     const imageURL=imageUpload.secure_url;
     await userModel.findByIdAndUpdate(userId,{
      image:imageURL
     })
    }

    
    // ✅ send success response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}


// apit to book Appointment
export const bookAppointment=async(req,res)=>{
  try {
    const userId = req.user._id; // ✅ comes from token authUser middleware, not body
    const {docId,slotDate,slotTime}=req.body;

    const docData=await doctorModel.findById(docId).select("-password");
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    if(!docData.available){
      return res.status(401).json({success:false,message:"Doctor not available"});
    }
    let slots_booked=docData.slots_booked;

    // checking for slot availablity
    if(slots_booked[slotDate]){
      if(slots_booked[slotDate].includes(slotTime)){
        return res.status(200).json({success:false,message:"Slots not available"})
      }
      else{
        slots_booked[slotDate].push(slotTime);
      }
    } else{
      slots_booked[slotDate]=[];
      slots_booked[slotDate].push(slotTime);
    }
    
    const userData=await userModel.findById(userId).select("-password");
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    delete docData.slots_booked;

    await appointmentModel.create({
        userId,
        docId,
        userData,
        docData,
        amount:docData.fees,
        slotTime,
        slotDate,
        date:Date.now(),
    });

    // save in slots data in docData
    // Update doctor’s booked slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.status(200).json({ success: true, message: 'Appointment booked successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}


// api to get user appointment for my appointment page
export const listAppointment=async(req,res)=>{
  try {
    const userId = req.user._id; // ✅ comes from token authUser middleware, not body
    const appointments=await appointmentModel.find({userId}); // all the appointment

    res.status(200).json({success:true,appointments});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}


// api to cancel appointment for my appointment page
export const cancelAppointment=async(req,res)=>{
  try {
    const userId = req.user._id; // ✅ comes from token authUser middleware, not body
    const {appointmentId}=req.body;
    const appointmentData=await appointmentModel.findById(appointmentId); // all the appointment

    // verify appointment User
    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true}); // all the appointment
    // releasing doctor slots
    const {docId,slotDate,slotTime}=appointmentData;

    const doctorData=await doctorModel.findById(docId);

    let slots_booked=doctorData.slots_booked;

    if(slots_booked[slotDate]) {
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
    }

    await doctorModel.findByIdAndUpdate(docId,{slots_booked});
    res.status(200).json({success:true,message:"Appointment cancelled successfully!"});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}


// Exchange rate: 1 USD → 83 INR (example)
// Exchange rate: 1 USD → 83 INR
const USD_TO_INR = 83;

// Helper function to convert amount to paise
const convertAmountToPaise = (amount, currencySymbol) => {
  if (currencySymbol === "$") {
    // Convert USD → INR → paise
    return Math.round(amount * USD_TO_INR * 100);
  } else if (currencySymbol === "Rs") {
    // INR → paise
    return Math.round(amount * 100);
  } else {
    throw new Error("Invalid currency type received");
  }
};

// API to create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { appointmentId, currencySymbol } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.status(401).json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    if (!appointmentData.amount || isNaN(appointmentData.amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount for appointment",
      });
    }

    if (!currencySymbol) {
      return res.status(400).json({
        success: false,
        message: "Currency type is required",
      });
    }

    // Always convert to INR paise
    const amountInPaise = convertAmountToPaise(appointmentData.amount, currencySymbol);

    const options = {
      amount: amountInPaise,
      currency: "INR", // Razorpay UI always shows INR
      receipt: appointmentId,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};




// api to online payment verify order
export const verifyOrder=async(req,res)=>{
  try {
    const {razorpay_order_id}=req.body;
    const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id);

    if(orderInfo.status==='paid'){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
      res.status(200).json({success:true,message:"Payment successful!"});
    }
    else{
      res.status(200).json({success:false,message:"Payment falied!"});
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}

