import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { userModel } from "../Database/Schema.js";

const JWT_SECRET = "AaloMeiMasala";
const userRouter = Router();

userRouter.post("/signup",async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const email = req.body.email;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!firstName || !lastName || !password || !email) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    
    const exisitingUser = await userModel.findOne({email});
    if(exisitingUser){
      return res.status(400).json("email already registered");
    }
    
    await userModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    })

  } catch (error) {
    console.error("Error during signup:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
});

userRouter.post("/signin", (req, res) => {});

userRouter.post("/owned", (req, res) => {});

export default userRouter;