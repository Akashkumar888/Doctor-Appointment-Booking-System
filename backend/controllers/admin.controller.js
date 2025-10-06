import doctorModel from '../models/doctor.model.js'
import {v2 as cloudinary} from 'cloudinary'
import {validationResult} from 'express-validator'
// api for adding doctor 
export const addDoctor=async(req,res)=>{
  try {
    const errors=validationResult(req);
    if(!errors.isEmpty()){ // empty nhi hai mtlb error hai
      return res.status(401).json({success:false,message:errors.array()});
    }

    const {name,email,password,speciality,degree,experience,about,fees,address}=req.body;
    const imageFile=req.file;
    // checking for all data to add doctor
    if(!name ||!email || !password || !speciality || !degree || !experience || !about || !fees || !address ){
      return res.status(400).json({success:false,message:'All fields are required.'});
    }
    

    // check if doctor exists
    const isAlreadyDoctorExist = await doctorModel.findOne({email});
    if (isAlreadyDoctorExist) {
      return res.status(400).json({ success: false, message: "Doctor already exists" });
    }

    
    // upload image to cloudinary
    const imageUpload=await cloudinary.uploader.upload(imageFile.path,{
      resource_type:"image"
    });
    const imageUrl=imageUpload.secure_url;
    
    // just pass raw password, Mongoose will hash automatically:  
    // create user (password gets hashed automatically by pre('save'))
  const doctorData={
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      image:imageUrl,
      date: Date.now()
      };
      
    const newDoctor=await doctorModel.create(doctorData);
    
    res.status(201).json({success:true,
      message:"Doctor added successfully"});

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}


// api for the admin login

export const loginAdmin=async(req,res)=>{
  try {
    const {email,passowrd}=req.body;
    if(email!==process.env.ADMIN_EMAIL){
      return res.status(401).json({success:false,message:"Invalid credentials"});
    }
    if(passowrd!==process.env.ADMIN_PASSWORD){
      return res.status(401).json({success:false,message:"Invalid credentials"});
    }

    const doctor=await doctorModel.findOne({email});
    const token=await doctor.generateAuthToken();
    
    res.status(201).json({success:false,mesage:"Login successfully",token});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}

