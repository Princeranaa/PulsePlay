import jwt from "jsonwebtoken";
import config from '../config/config.js'

export const authArtistMiddleware = async (req,res,next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token,config.JWT_SECRET);
        if(decoded.role !== "artist"){
            return res.status(401).json({
                message: "Forbidden"
            })
        }
        req.user = decoded;
        next();

    } catch (error) {
        res.status(500).json({
            message: "token missing"
        })
    }



}

