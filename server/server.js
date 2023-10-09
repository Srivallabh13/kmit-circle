import express from "express"
import { config } from "dotenv"
import {fileURLToPath} from 'url'
import path from "path";
import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import pathRoute from './routes/post.js'
import chatRouter from './routes/chat.js'
import messageRouter from './routes/message.js'
import blogRoute from './routes/blog.js'
import categoryRoute from './routes/categories.js'
import customErrorHandler from './middlewares/error.js'
import cors from 'cors'
import cookieParser from "cookie-parser"
import { isAuth } from "./middlewares/auth.js"
import multer from "multer"
import { register } from "./controllers/auth.js"
import { updateUser } from "./controllers/user.js";
import { createPost, updatePost } from "./controllers/post.js";
import { createBlog, updateBlog } from "./controllers/blog.js";
// configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const app = express()

config({ path: '/.env' })

// middlewares
app.use(cookieParser())
app.use(express.json());
app.use(express.json({ limit: '10mb' }));

app.use(cors({
    credentials:true,
    origin:['https://campuscircle17.netlify.app'],
    methods: ['POST','GET', 'DELETE', 'PUT']
}))

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, "public/assets");
    },
    filename: function(req,file, cb) {
        cb(null, file.originalname);
    },
});

let new_token='';
app.post('/api/', (req,res)=> {

    const {token} = req.body;
    new_token = token;
    console.log(new_token);
    res.json({
        success:true,
        message:"done",
        new_token
    })
})
function middleware1(req, res, next) {
    console.log("mid 1 ",new_token)
    res.locals.token = new_token;
    next();
  }

const upload = multer({storage});

app.post('/api/auth/register', upload.single("picture"), register)
app.put('/api/users/update', middleware1, isAuth, upload.single("picture"), updateUser)
app.post('/api/post/new', middleware1, isAuth, upload.single("picture"), createPost);
app.put('/api/post/:id', middleware1, isAuth, upload.single("picture"), updatePost)
app.post('/api/blog/new', middleware1, isAuth, upload.single("picture"), createBlog);
app.put('/api/blog/:id', middleware1, isAuth, upload.single("picture"), updateBlog)

app.use("/api/auth", authRoute)
app.use("/api/users", middleware1, isAuth, userRoute)
app.use("/api/post", middleware1, isAuth, pathRoute)
app.use("/api/chat", middleware1, isAuth, chatRouter)  
app.use("/api/message", middleware1, isAuth, messageRouter)
app.use("/api/blog", middleware1, isAuth, blogRoute)
app.use("/api/category", middleware1, isAuth, categoryRoute)

// last middleware to use is for Error handling
app.use(customErrorHandler)

app.get('/', (req,res)=> {
    res.send("hello")
})