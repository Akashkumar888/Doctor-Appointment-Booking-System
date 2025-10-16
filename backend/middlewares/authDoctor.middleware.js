import  jwt  from "jsonwebtoken";
import doctorModel from "../models/doctor.model.js";
import blackListModel from "../models/blackListToken.model.js";


export const authDoctor=async(req,res,next)=>{
 try {
  const authHeader=req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json({success:false,message:"Not Authorized"});
  }
  const token=authHeader.split(" ")[1];
  const isBlackListToken=await blackListModel.findOne({token});
    if(isBlackListToken){
      return res.status(400).json({success:false,message:'Token expired/blacklisted'})
    }
  const decoded=jwt.verify(token,process.env.JWT_SECRET);
  const docId=decoded._id || decoded.id;
  const doctor=await doctorModel.findById(docId);
  if(!doctor){
    return res.status(401).json({success:false,message:'User Not found.'});
  }
  req.doctor=doctor; // attach doctor 
  next();
 } catch (error) {
  console.log(error);
  res.status(500).json({success:true,message:error.message});
 }
}

