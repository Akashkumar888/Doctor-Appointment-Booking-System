
import express from 'express'
import { doctorList, loginDoctor } from '../controllers/doctor.controller.js';
const doctorRouter=express.Router();

import {body} from 'express-validator'

doctorRouter.get('/list',doctorList);
doctorRouter.post('/login',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:8}).withMessage('Invalid password'),
  ],loginDoctor);

export default doctorRouter;