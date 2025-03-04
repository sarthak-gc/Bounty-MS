
import mongoose from "mongoose";

interface studentI {
  name: string;
  email: string;
  username: string;
  password: string;
  //maybe add no of solved bounties, but can be derived from bounties
  // noOfBounties: number
}

const studentSchema = new mongoose.Schema<studentI>({
  name: String,
  email: String,
  username: String,
  password: String,
});

export const studentModel = mongoose.model("student", studentSchema);
