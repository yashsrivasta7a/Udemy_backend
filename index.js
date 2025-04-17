import express from "express";
import userRouter from "./Router/userRouter.js"
import courseRouter from "./Router/courseRouter.js"
import adminRouter from "./Router/adminRouter.js"
import mongoose from "mongoose";
import dotenv from "dotenv";
const app = express();

dotenv.config();
app.use(express.json());
app.use('/api/v1/user',userRouter);
app.use('/api/v1/course',courseRouter);
app.use('/api/v1/admin',adminRouter);

async function main (){
    try {
    await mongoose.connect(process.env.db);
    app.listen(3000);
    } catch (error) {
        throw new Error("backend is down")
    }
    console.log('database running fine');
    
}

main();