import mongoose, { Schema } from "mongoose";
import { UserInterface } from "../types/user";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  activatedUser: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<UserInterface>("User", userSchema);
