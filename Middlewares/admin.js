import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config.js"


const auth=(req,res,next)=>{
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.adminId = decoded.id;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };
  
  export default auth;