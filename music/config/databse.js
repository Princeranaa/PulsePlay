import mongoose, { mongo } from "mongoose";
import config from "../config/config.js";

export const connectDb = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("database connected");
  } catch (error) {
    console.log("something went wrong to connect the server");
  }
};
