import userModel from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';



export const register = async (req,res) => {
    try {
        const {email, fullname:{firstname,lastname},password} = req.body;

         const isUserExist = await userModel.findOne({email});
         
         if(isUserExist){
            return res.status(400).json({
                message:"User Already Exist"
            })
         }

         const hash = await bcrypt.hash(password,10);

         /* create a user */
         const user = await userModel.create({
            email,
            fullname:{firstname,lastname},
            password:hash
         });
         
         const token = jwt.sign({id:user._id, role:user.role},config.JWT_SECRET,{expiresIn:"2d"})
         res.cookie("token", token)

         res.status(201).json({
            message:"User Registered Successfully",
            user:{
                _id:user._id,
                email:user.email,
                fullname:user.fullname,
                role:user.role
            },
         })
        



    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}





