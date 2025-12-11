import mongoose from 'mongoose'
import config from '../config/config.js'

export const connectToDb = async()=>{
    try {
        await mongoose.connect(config.MONGO_URL);
        console.log("Mongoose connection success")
    } catch (error) {
        console.log("Mongoose connection error",error)
    }
}