import mongoose from 'mongoose'
import config from '../config/config'

exports.connectToDb = ()=>{
    try {
        mongoose.connect(config.MONGO_URL)
    } catch (error) {
        console.log("Mongoose connection error",error)
    }
}