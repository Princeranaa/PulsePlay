import { userModel } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { publishToQueue } from "../broker/rabit.js";

export const register = async (req, res) => {
  try {
    const {
      email,
      fullname: { firstname, lastname },
      password,
    } = req.body;

    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        message: "User Already Exist",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    /* create a user */
    const user = await userModel.create({
      email,
      fullname: { firstname, lastname },
      password: hash,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "2d" }
    );
    res.cookie("token", token);

    await publishToQueue("user_created", {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const googleAuthCallback = async (req, res) => {
  const user = req.user;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email: user.emails[0].value }, { googleId: user.id }],
  });

  if (isUserAlreadyExists) {
    const token = jwt.sign(
      {
        id: isUserAlreadyExists._id,
        role: isUserAlreadyExists.role,
        fullname: isUserAlreadyExists.fullname,
      },
      config.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.cookie("token", token);

    // ✔ FIX: STOP here. Don't continue.
    return res.status(200).json({
      message: "Login successful",
      user: isUserAlreadyExists,
    });
  }

  const newUser = await userModel.create({
    googleId: user.id,
    email: user.emails[0].value,
    fullname: {
      firstName: user.name.givenName,
      lastName: user.name.familyName,
    },
  });

  await publishToQueue("user_created", {
    id: newUser._id,
    email: newUser.email,
    fullname: newUser.fullname,
    role: newUser.role,
  });

  const token = jwt.sign(
    {
      id: newUser._id,
      role: newUser.role,
      fullname: newUser.fullname,
    },
    config.JWT_SECRET,
    { expiresIn: "2d" }
  );

  res.cookie("token", token);

  // res.redirect('http://localhost:5173');
};


export const login = async(req,res)=>{
 const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
        fullname: user.fullname
    }, config.JWT_SECRET, { expiresIn: "2d" })

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            role: user.role
        }
    })
}