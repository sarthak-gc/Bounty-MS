import mongoose from "mongoose";

interface studentI {
  name: string;
  email: string;
  username: string;
  password: string;
  //maybe add no of solved bounties, but can be derived from bounties
  // noOfBounties: number
  role: string;
}

const studentSchema = new mongoose.Schema<studentI>({
  name: { type: String },
  email: { type: String },
  username: { type: String },
  password: { type: String },
  role: { type: String, default: "student" },
});

export const studentModel = mongoose.model<studentI>("student", studentSchema);
