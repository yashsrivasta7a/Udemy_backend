import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});
const adminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});
const courseSchema = new Schema({
  title: { type: String, unique: true },
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId,
});
const purchaseSchema = new Schema({
  courseId: ObjectId,
  userId: ObjectId,
});


export const userModel = mongoose.model('users',userSchema);
export const adminModel = mongoose.model('admin',adminSchema);
export const courseModel = mongoose.model('course',courseSchema);
export const purchaseModel = mongoose.model('purchase',purchaseSchema);


