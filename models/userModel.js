import mongoose from "mongoose";

const user = new mongoose.Schema(
  {
    name: String,
    email: { type: String, require: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("user", user);
