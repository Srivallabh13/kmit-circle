import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import ErrorHandler from '../utils/errorhandler.js'
// import {LocalStorage} from 'node-localstorage';

// var localStorage = new LocalStorage('./scratch');
export const isAuth = async(req,res,next) => {
    try {
        
        // console.log("is req start: ")
        // console.log("is req: ",req)
        // console.log("is req end: ")
        console.log("is Auth: ", req?.cookies)
        const token = req?.cookies?.token;
        console.log("is token: ", req?.cookies.token)
        if(!token) {
            return next(new ErrorHandler("Please login first", 401))
        } 
    
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
    
        req.user = await User.findById(decode._id)
        next()
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}