
import express from 'express'
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorList, doctorProfile, loginDoctor, updateDoctorProfile } from '../controllers/doctor.controller.js';
const doctorRouter=express.Router();

import {body} from 'express-validator'
import { authDoctor } from '../middlewares/authDoctor.middleware.js';

doctorRouter.get('/list',doctorList);
doctorRouter.post('/login',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:8}).withMessage('Invalid password'),
  ],loginDoctor);


doctorRouter.get('/appointments',authDoctor,appointmentsDoctor);
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete);
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel);
doctorRouter.get('/dashboard',authDoctor,doctorDashboard);
doctorRouter.get('/profile',authDoctor,doctorProfile);
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile);

export default doctorRouter;