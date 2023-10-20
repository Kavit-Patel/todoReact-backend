import express from "express";
import cookie_parser from "cookie-parser";
import cors from "cors";
import { config, configDotenv } from "dotenv";
import { userRouter } from "./routes/user-route.js";
import { connectDB } from "./db/connection.js";
import { taskRouter } from "./routes/task-route.js";

// configDotenv();
config({ path: config.env });
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookie_parser());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.listen(process.env.PORT, () =>
  console.log(
    `Server running at ${process.env.PORT} in ${process.env.NODE_MODE} mode`
  )
);

app.use("/user", userRouter);
app.use("/task", taskRouter);

app.use((err, req, res, next) => {
  console.log("error");
  return res.status(err.statusCode).json({ error: err.message });
});
