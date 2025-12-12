import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
const app = express()
import authRoutes from './routes/auth.routes.js'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import config from './config/config.js'
import cors from 'cors'


app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(passport.initialize());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

// Configure Passport to use Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: config.Client_ID,
  clientSecret: config.Client_Secret,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));


app.use('/api/auth', authRoutes)


export default app;
