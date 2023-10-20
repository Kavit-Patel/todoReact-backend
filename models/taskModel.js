import mongoose from "mongoose";

const task = new mongoose.Schema({
  title: String,
  desc: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
});

export const taskModel = mongoose.model("task", task);
