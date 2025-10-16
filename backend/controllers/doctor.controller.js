import appointmentModel from "../models/appointment.model.js";
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

// api user logout 
export const logoutDoctor=async(req,res)=>{
  try {
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({success:false,message:'Not authorized'}); 
    }
    const token=authHeader.split(" ")[1];
    if(!token)return res.status(401).json({success:false,message:"Token Not found"});
    await blackListModel.create({token});
    res.json({ success: true, message: "Logged out successfully!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}


// api to get doctor appointments for doctor panel
export const appointmentsDoctor=async(req,res)=>{
  try {
    const docId=req.doctor._id;// ✅ comes from token authDoctor middleware, not body
    const appointments=(await appointmentModel.find({docId})).reverse(); // for latest appointments 
    res.status(200).json({success:true,appointments});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}

// api to mark appointment completed for doctor panel
export const appointmentComplete = async (req, res) => {
  try {
    const docId=req.doctor._id;// ✅ comes from token authDoctor middleware, not body
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
      res.status(200).json({ success: true, message: "Appointment Completed" });
    } else {
      res.status(401).json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to cancel appointment for doctor panel
export const appointmentCancel = async (req, res) => {
  try {
    const docId=req.doctor._id;// ✅ comes from token authDoctor middleware, not body
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
      res.status(200).json({ success: true, message: "Appointment Cancelled" });
    } else {
      res.status(401).json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// api to get dashboard data for doctor panel
export const doctorDashboard=async(req,res)=>{
  try {
    const docId=req.doctor._id;// ✅ comes from token authDoctor middleware, not body
    const appointments=await appointmentModel.find({docId});
    let earnings=0;

    appointments.map((item,)=>{
      if(item.isCompleted || item.payment){
        earnings+=item.amount;
      }
    });

    let patients=[];

    appointments.map((item)=>{
     if(!patients.includes(item.userId)){
      patients.push(item.userId);
     }
    });
    const dashData={
      earnings,
      appointments:appointments.length,
      patients:patients.length,
      latestAppointments:appointments.reverse().slice(0,5)
    };
    res.status(200).json({success:true,dashData});

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}



// ✅ Summary Table
// Context	Syntax	Use {} or ()	                                  Return Behavior
// Backend (JS logic)	         .map((item) => { ... })	{}	       Must use return explicitly
// Frontend (React JSX)	       .map((item) => ( ... ))	()	               Implicit return of JSX
// Frontend (React JSX, complex logic)	.map((item) => { ... return (...) })	{}	Explicit return needed


// 🧠 What “Return” Means
// Every function in JavaScript can return a value.
// Example:
// function add(a, b) {
//   return a + b;
// }

// Here, return explicitly tells the function what value to give back.
// ✅ 1️⃣ Explicit Return (You Write return)
// You use curly braces {}, which means you have a function body.
// So you must explicitly say what to return.
// // Explicit return example
// const result = [1, 2, 3].map((num) => {
//   return num * 2;  // 👈 explicitly written
// });
// console.log(result); // [2, 4, 6]

// If you forget return when using {}, you’ll get [undefined, undefined, undefined].
// ✅ 2️⃣ Implicit Return (No return Keyword)
// You use parentheses () instead of {}.
// That means the function will automatically (implicitly) return whatever is inside the parentheses.

// // Implicit return example
// const result = [1, 2, 3].map((num) => (
//   num * 2  // 👈 automatically returned
// ));
// console.log(result); // [2, 4, 6]
// No need to write return — JS does it for you automatically.
// 💻 In React JSX
// ✅ Implicit return (short, clean JSX):

// {items.map((item) => (
//   <p>{item}</p>
// ))}

// ✅ Explicit return (when you add logic before returning JSX):
// {items.map((item) => {
//   if (!item) return null;
//   return <p>{item}</p>;
// })}
