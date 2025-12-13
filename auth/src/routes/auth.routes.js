import express from "express";
const router = express.Router();
import {googleAuthCallback, register,login} from '../controllers/auth.controller.js'
import * as validationRules from '../Middlewares/Validation.middleware.js'
import passport from 'passport';

router.post('/register', validationRules.registerValidation, register);
router.post('/login', validationRules.loginValidation, login);

// Route to initiate Google OAuth flow
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


// Callback route that Google will redirect to after authentication
router.get('/google/callback', passport.authenticate('google', { session: false }),googleAuthCallback);

export default router;
