import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken'
import blackListModel from '../models/blackListToken.model.js'
import {v2 as cloudinary} from 'cloudinary'

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
      message:'User created Successfully',token});

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
    message:'Login successfully',
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
    await blackListModel.create({token});
    res.json({ success: true, message: "Logged out successfully" });

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
      { name, phone, address, dob, gender },
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
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}