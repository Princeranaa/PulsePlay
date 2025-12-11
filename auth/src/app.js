import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'



const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))



export default app;
