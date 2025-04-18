import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { JWT_SECRET_ADMIN } from "../config.js";
import auth from "../Middlewares/admin.js";
import { adminModel, courseModel } from "../Database/Schema.js";

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  const AdminSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
    firstName: z.string(),
    lastName: z.string(),
  });

  const validate = AdminSchema.parse(req.body);
  const { firstName, lastName, password, email } = validate;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!firstName || !lastName || !password || !email) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json("Email already registered");
    }
    await adminModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    res.status(201).json({ message: "Admin registered successfully." });
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

adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({ email: email });
  if (!admin) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (admin && validPassword) {
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      JWT_SECRET_ADMIN
    );

    res.json({
      token: token,
    });
  }
});

adminRouter.post("/course", auth, async (req, res) => {
  const adminId = req.adminId;

  const { title, description, price, imageUrl } = req.body;

  const courses = await courseModel.create({
    title: title,
    description: description,
    price: price,
    imageUrl: imageUrl,
    creatorId: adminId,
  });
  res.json({
    message: "Course created successfully.",
    course: courses,
  });
});


adminRouter.put("/course", auth, async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price, imageUrl, courseId } = req.body;

  
    const updatedCourse = await courseModel.findOneAndUpdate(
      { _id: courseId, creatorId: adminId }, // filter
      { title, description, price, imageUrl }, // update
      { new: true } // return the updated document
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    res.json({
      message: "Course updated successfully.",
      course: updatedCourse,
    });
  }


adminRouter.put("/course/all", auth, async (req, res) => {
  const adminId = req.adminId; // jo bhi auth m dala hai wo
  try {
    const course = await courseModel.find({
      creatorId: adminId,
    });
    res.json({
      message: "Course fetching successfully.",
      courseId: course._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch course. Please try again later.",
    });
  }
});

export default adminRouter;
