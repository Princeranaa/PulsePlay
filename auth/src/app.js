import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
const app = express()
import authRoutes from './routes/auth.routes.js'





app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.use('/api/auth', authRoutes)






export default app;
