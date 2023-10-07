import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import ErrorHandler from '../utils/errorhandler.js'
// import {LocalStorage} from 'node-localstorage';

// var localStorage = new LocalStorage('./scratch');
export const isAuth = async(req,res,next) => {
    try {
        const {new_token} = req.cookies
        const {token} = req.cookies
        console.log("new token ",new_token);
        console.log("token ",token);

        if(!new_token) {
            return next(new ErrorHandler("Please login first", 401))
        } 
    
        const decode = await jwt.verify(new_token, process.env.JWT_SECRET)
    
        req.user = await User.findById(decode._id)
        next()
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}