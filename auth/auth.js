import jwt from "jsonwebtoken";
import { newError } from "../errorHandler/newError.js";
import { userModel } from "../models/userModel.js";

export const auth = async (req, res, next) => {
  const { todo_token } = req.cookies;
  console.log(todo_token);
  try {
    const decoded = jwt.verify(todo_token, process.env.JSW_SECRET);
    if (!decoded) return next("Token is Invalid", 403);
    const user = await userModel.findById(decoded.userId);
    if (!user) return next("user not found", 404);
    req.user = user;
    next();
  } catch (error) {
    next(new newError(error.message, 500));
  }
};
