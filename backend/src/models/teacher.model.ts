import mongoose from "mongoose";

interface teacherI {
  name: string;
  email: string;
  username: string;
  password: string;
}

const teacherSchema = new mongoose.Schema<teacherI>({
  name: String,
  email: String,
  username: String,
  password: String,
});

export const teacherModel = mongoose.model("teacher", teacherSchema);
