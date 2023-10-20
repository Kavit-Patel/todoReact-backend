import mongoose from "mongoose";

export const connectDB = () =>
  mongoose
    .connect(process.env.MONGO_CLOUD, { dbName: "todoReact" })
    .then((c) => console.log(`connected at ${c.connection.host}`));
