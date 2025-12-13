import express from 'express'
const app = express()
import musicRouter from "./routes/music.routes.js";
import cookieParser from "cookie-parser";






app.use(express.json());
app.use(cookieParser());

app.use("/api/music", musicRouter)



export default app