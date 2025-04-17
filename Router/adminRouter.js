import { Router } from "express";
import {adminModel} from '../Database/Schema.js'
const adminRouter = Router();


adminRouter.post('/signup',(req,res)=>{
    req.json({
        message:"ulala ulala"
    })
});
adminRouter.post('/signin',(req,res)=>{});
adminRouter.post('/course',(req,res)=>{});
adminRouter.put('/course/change',(req,res)=>{});
adminRouter.get('/course/all',(req,res)=>{});

export default adminRouter;