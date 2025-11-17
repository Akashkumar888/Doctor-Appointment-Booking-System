
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const doctorSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    minlength:8,
    select:false,
    // For sensitive data, always set select: false for password and other sensitive fields, which you are already doing.
  },
  image:{
    type:String,
    required:true
  },
  speciality:{
    type:String,
    required:true
  },
  degree:{
    type:String,
    required:true
  },
  experience:{
    type:String,
    required:true
  },
  about:{
    type:String,
    required:true
  },
  available:{
    type:Boolean,
    default:true
  },
  fees:{
    type:Number,
    required:true
  },
  address:{
    type:Object,
    required:true
  },
  date:{
    type:Date,
    required:true,
    default:Date.now()
  },
  slots_booked:{
    type:Object,
    default:{}
  },
},{timestamps:true,minimize:false});

// Hash password before saving
// Pre-save hook ensures you never store plain text passwords.
// Use pre('save') for password hashing + instance methods for comparison & token generation.
// just pass raw password, Mongoose will hash automatically:  
// create user (password gets hashed automatically by pre('save'))
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// it needs to call 
// // doctor hash password
// doctorSchema.statics.hashPassword=async function (password) {
//   const salt=await bcrypt.genSalt(10);
//   const hash=await bcrypt.hash(password,salt);
//   return hash;
// }


// Compare password (instance method)
doctorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const doctorModel=mongoose.models.Doctor || mongoose.model('Doctor',doctorSchema);

export default doctorModel;