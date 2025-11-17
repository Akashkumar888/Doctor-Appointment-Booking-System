
import express from 'express'
import { body } from 'express-validator';
import { authUser } from '../middlewares/authUser.middleware.js';
import {  bookAppointment, cancelAppointment, createOrder, getProfile, listAppointment, loginUser, registerUser, updateProfile, verifyOrder } from '../controllers/user.controller.js';
import upload from '../middlewares/multer.middleware.js';
const userRouter=express.Router();


userRouter.post('/register',[
  body('name').notEmpty().withMessage("Name is required"),
  body('email').isEmail().withMessage("Invalid email"),
  body('password').isLength({min:8}).withMessage("Please enter a strong password")
],
registerUser);

userRouter.post("/login", [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({min:8}).withMessage("Please enter a strong password")
], loginUser);

// only here add authUser
userRouter.get("/get-profile",authUser,getProfile);
userRouter.put("/update-profile",authUser,upload.single('image'),updateProfile);
userRouter.post("/book-appointment",authUser,bookAppointment);
userRouter.get("/appointments",authUser,listAppointment);
userRouter.post("/cancel-appointment",authUser,cancelAppointment);
userRouter.post("/create-order",authUser,createOrder);
userRouter.post("/verify-order",authUser,verifyOrder);

// PUT is usually for updating an existing resource.
// You should use PUT for your updateProfile route because the user already exists, and you are updating their data.

export default userRouter;