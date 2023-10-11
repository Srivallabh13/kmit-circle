import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import ErrorHandler from '../utils/errorhandler.js'
// import {LocalStorage} from 'node-localstorage';

// var localStorage = new LocalStorage('./scratch');
export const isAuth = async(req,res,next) => {
    try {
        
        console.log("is Auth: ",token)
        console.log("is req: ",req)
        const {token} = req.cookie
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