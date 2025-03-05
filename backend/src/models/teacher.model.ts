import mongoose from "mongoose";

interface teacherI {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

const teacherSchema = new mongoose.Schema<teacherI>({
  name: String,
  email: String,
  username: String,
  password: String,
  role: { type: String, default: "teacher" },
});

export const teacherModel = mongoose.model<teacherI>("teacher", teacherSchema);
