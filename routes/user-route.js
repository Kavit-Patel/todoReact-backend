import express from "express";
import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { newError } from "../errorHandler/newError.js";
import jwt from "jsonwebtoken";
import { auth } from "../auth/auth.js";
import { now } from "mongoose";

export const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json(user);
  } catch (error) {
    return next(new newError(error.message, 403));
  }
});
userRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return next(new newError("invalid user", 403));
    const hashedPassword = user.password;
    const unhashedPassword = await bcrypt.compare(password, hashedPassword);
    if (unhashedPassword === false) {
      return next(new newError("invalid password", 404));
    }
    const token = jwt.sign({ userId: user._id }, process.env.JSW_SECRET);
    res
      .cookie("todo_token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_MODE === "Development" ? "lax" : "none",
        secure: process.env.NODE_MODE === "Development" ? false : true,
      })
      .status(200)
      .json(user);
  } catch (error) {
    next(new newError(error.message, 404));
  }
});
userRouter.get("/logout", auth, async (req, res, next) => {
  try {
    console.log("first");
    res
      .status(200)
      .cookie("todo_token", "", { expires: new Date(Date.now()) })
      .json({ message: "logout successful" });
  } catch (error) {
    next(error.message, 404);
  }
});
