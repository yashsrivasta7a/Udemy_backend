import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { courseModel, userModel } from "../Database/Schema.js";
import { z } from "zod";
import { JWT_SECRET } from "../config.js";
import auth from "../Middlewares/user.js";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  // const firstName = req.body.firstName;
  // const lastName = req.body.lastName;
  // const password = req.body.password;
  // const email = req.body.email;

  const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
    firstName: z.string(),
    lastName: z.string(),
  });

  const validate = UserSchema.parse(req.body);
  const { firstName, lastName, password, email } = validate;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!firstName || !lastName || !password || !email) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(400).json("email already registered");
    }
    await userModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: error.errors });
    }
    console.error("Error during signup:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (user && validPassword) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
    });
  }
});

userRouter.post("/owned", auth, async (req, res) => {
  const userId = req.userId;
});

export default userRouter;
