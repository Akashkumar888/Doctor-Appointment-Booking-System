
import express from 'express'
import upload from '../middlewares/multer.middleware.js';
import { addDoctor, loginAdmin } from '../controllers/admin.controller.js';
const adminRouter=express.Router();
import {body} from 'express-validator';
import { authAdmin } from './authAdmin.middleware.js';


// backend image store krne ke liye multer.diskStorage or multer.memoryStorage use krte hai for upload single image or multiple imaeges upload 
// For uploading images in backend, we use multer with either:
// 1. multer.diskStorage  -> stores images on disk
// 2. multer.memoryStorage -> stores images in memory

// To upload a single image: use upload.single("image")
// To upload multiple images: use upload.array("images")

adminRouter.post("/add-doctor",authAdmin, upload.single("image"), // multer first
[
  body('email').isEmail().withMessage("Invalid Email"),
  body('password').isLength({min:8}).withMessage("Please enter a strong message"),
],addDoctor);

adminRouter.post("/login",authAdmin, loginAdmin);

export default adminRouter;