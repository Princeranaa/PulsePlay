import express from "express";
const router = express.Router();
import {register} from '../controllers/auth.controller.js'
import * as validationRules from '../Middlewares/Validation.middleware.js'

router.post('/register', validationRules.registerValidation, register);



export default router;
