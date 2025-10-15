import doctorModel from "../models/doctor.model.js";
import {validationResult} from 'express-validator'


export const changeAvailability=async(req,res)=>{
  try {
    const {docId}=req.body;
    const docData=await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId,{available: !docData.available});
    res.status(201).json({success:true,message:'Availability Changed'});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}

export const doctorList=async(req,res)=>{
  try {
    const doctors=await doctorModel.find({}).select(['-password','-email']);
    res.status(201).json({success:true,doctors});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}


// api for doctor login
export const loginDoctor=async(req,res)=>{
  try {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(401).json({success:false,message:errors.array().map(err=>err.msg)});
    }
    const {email,password}=req.body;
    const doctor = await doctorModel.findOne({ email }).select('+password');
    if(!doctor){
      return res.status(401).json({success:false,message:'Invalid credentials'});
    }
    const isMatch=await doctor.comparePassword(password);
    if(!isMatch){
      return res.status(401).json({success:false,message:'Password incorrect'});
    }
    const token=doctor.generateAuthToken();
    const safeDoctor=doctor.toObject();
    delete safeDoctor.password;
    res.status(200).json({success:true,message:'Login successfully!',token});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}
