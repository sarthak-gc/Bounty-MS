import mongoose from "mongoose";

export enum RegistrationStatus {
  Pending = "Pending",
  Verified = "Verified",
  Rejected = "Rejected",
}
export interface RegistrationStudentI {
  name: string;
  email: string;
  username: string;
  password: string;
  //maybe add no of solved bounties, but can be derived from bounties
  // noOfBounties: number
  status: RegistrationStatus;
  role: string;
}

export interface RegistrationTeacherI {
  name: string;
  email: string;
  username: string;
  password: string;
  status: RegistrationStatus;
  role: string;
}
const RegistrationStudentSchema = new mongoose.Schema<RegistrationStudentI>({
  name: String,
  email: String,
  username: String,
  password: String,
  role: { type: String, default: "student" },
});

const RegistrationTeacherSchema = new mongoose.Schema<RegistrationTeacherI>({
  name: String,
  email: String,
  username: String,
  password: String,
  role: { type: String, default: "teacher" },
});
export const RegistrationStudentModel = mongoose.model<RegistrationStudentI>(
  "studentRegistration",
  RegistrationStudentSchema
);

export const RegistrationTeacherModel = mongoose.model<RegistrationTeacherI>(
  "teacherRegistration",
  RegistrationTeacherSchema
);
