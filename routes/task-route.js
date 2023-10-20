import express from "express";
import { newError } from "../errorHandler/newError.js";
import { taskModel } from "../models/taskModel.js";
import { userModel } from "../models/userModel.js";
import { auth } from "../auth/auth.js";

export const taskRouter = express.Router();
taskRouter.get("/all", auth, async (req, res, next) => {
  const user = req.user;
  try {
    const tasks = await taskModel.find({ user: user._id });
    res.status(200).json({ user, tasks });
  } catch (error) {
    next(error.message, 404);
  }
});
taskRouter.get("/singleTask/:id", auth, async (req, res, next) => {
  const user = req.user;
  try {
    const task = await taskModel.findById(req.params.id);
    res.status(200).json(task);
  } catch (error) {
    next(error.message, 404);
  }
});

taskRouter.post("/add", auth, async (req, res, next) => {
  try {
    const user = req.user;
    const { title, desc } = req.body;
    const task = await taskModel.create({ title, desc, user });
    res.status(201).json(task);
  } catch (error) {
    next(new newError(error.message, 404));
  }
});
taskRouter.put("/update/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  const { title, desc } = req.body;
  try {
    const user = req.user;
    const task = await taskModel.findById(id);
    if (!task) return next(new newError("Task not found", 404));
    const loginUser = String(user._id);
    const taskUser = String(task.user._id);
    if (loginUser !== taskUser) {
      console.log("not get");
      return next(new newError(`This task is created by ${user.name}`, 403));
    }
    const updatedTask = await taskModel.findByIdAndUpdate(id, { title, desc });
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error.message, 403);
  }
});

taskRouter.delete("/delete/:id", auth, async (req, res, next) => {
  try {
    const user = req.user;
    const task = await taskModel.findById(req.params.id);
    console.log(user, task);
    const currentUser = String(user._id);
    const currentTask = String(task.user._id);
    if (currentUser !== currentTask)
      return next(
        `${user.name}, is not allowed to delete task created by ${task.user.name}`,
        403
      );
    const deletedTask = await taskModel.deleteOne({ _id: task._id });
    res.status(200).json(deletedTask);
  } catch (error) {
    next(error.message, 404);
  }
});
