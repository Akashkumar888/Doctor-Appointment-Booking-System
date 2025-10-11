import doctorModel from "../models/doctor.model.js";

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
