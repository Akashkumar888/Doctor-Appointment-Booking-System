
import express from 'express'
import upload from '../middlewares/multer.middleware.js';
import { addDoctor, adminDashboard, allDoctors, appointmentCancel, appointmentsAdmin, loginAdmin } from '../controllers/admin.controller.js';
const adminRouter=express.Router();
import {body} from 'express-validator';
import { authAdmin } from '../middlewares/authAdmin.middleware.js';
import { changeAvailability } from '../controllers/doctor.controller.js';


// backend image store krne ke liye multer.diskStorage or multer.memoryStorage use krte hai for upload single image or multiple imaeges upload 
// For uploading images in backend, we use multer with either:
// 1. multer.diskStorage  -> stores images on disk
// 2. multer.memoryStorage -> stores images in memory

// To upload a single image: use upload.single("image")
// To upload multiple images: use upload.array("images")


adminRouter.post("/add-doctor",
  authAdmin,
  upload.single("image"),
  [
    body('name').notEmpty().withMessage("Name is required"),
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').isLength({ min: 8 }).withMessage("Please enter a strong password"),
    body('speciality').notEmpty().withMessage("Speciality is required"),
    body('degree').notEmpty().withMessage("Degree is required"),
    body('experience').notEmpty().withMessage("Experience is required"),
    body('about').notEmpty().withMessage("About is required"),
    body('fees').notEmpty().withMessage("Fees is required"),
    body('address').notEmpty().withMessage("Address is required"),
  ],
  addDoctor
);

adminRouter.post("/login",[
  body('email').isEmail().withMessage("Invalid Email"),
  body('password').isLength({min:8}).withMessage("Please enter a strong message"),
], 
  loginAdmin);


adminRouter.post("/all-doctors",authAdmin,allDoctors);
adminRouter.post("/change-availability",authAdmin,changeAvailability);
adminRouter.get("/appointments",authAdmin,appointmentsAdmin);
adminRouter.post("/cancel-appointment",authAdmin,appointmentCancel);
adminRouter.get("/dashboard",authAdmin,adminDashboard);

export default adminRouter;