import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';
import User from '../models/User.js'
import ErrorHandler from "../utils/errorhandler.js";

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        // console.log(email, password);
        const user = await User.findOne({email}).select("+password");
        if(!user) {
            return next(new ErrorHandler("email doesnot exists", 400));
        }
        // console.log(user);
        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            return next(new ErrorHandler("Invalid Password", 400));
        }
        
        const new_token = await jwt.sign({_id:user._id}, process.env.JWT_SECRET);
        
        res.status(200).cookie("new_token", new_token, {
            secure: true,
            maxAge: 90 * 24 * 60 * 60* 1000,
        }).json({
            success:true,
            message:"cookie created and login successful",
            user,
            new_token
        });
    }catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}

// controllers/authController.js
export const logout = async (req, res, next) => {
    try {
      // localStorage.clear();
      // console.log(localStorage.getItem('token'));
      res
        .status(200)
        .clearCookie("new_token")
        .json({
          message: "Logout done!",
        });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  };

export const register = async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, avatar } = req.body;
  
      let user = await User.findOne({ email }).select('+password');
      if (user) {
        return next(new ErrorHandler('User already exists', 404));
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        avatar,
      });
      await newUser.save();
    
      res.status(200).json('Registered successfully!');
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  };
  