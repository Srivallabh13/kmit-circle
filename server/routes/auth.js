import express from "express";
import {login, logout} from '../controllers/auth.js'
import { isAuth } from "../middlewares/auth.js";
const router = express.Router();


router.get('/logout', isAuth, logout);
router.post('/login', isAuth, login);

export default router