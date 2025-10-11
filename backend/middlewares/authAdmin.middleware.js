
import jwt from 'jsonwebtoken'
import blackListModel from '../models/blackListToken.model.js';


// admin authentication middleware 
export const authAdmin=async(req,res,next)=>{
  try {
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({succcess:false,message:"Not authorized login again"});
    }
    const token=authHeader.split(" ")[1];
    const isBlackListToken=await blackListModel.findOne({token});
    if(isBlackListToken){
      return res.status(401).json({success:false,message:'Token expired/blacklisted'});
    }
     // verify JWT
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    if(decoded!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
      return res.status(401).json({success:false,message:'Token is Invalid'});
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}
