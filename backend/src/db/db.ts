import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  await mongoose.connect(process.env.DB_URL as string);
  console.log("Connection Established");
};

connectDB();
