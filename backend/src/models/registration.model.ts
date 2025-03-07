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
  status: RegistrationStatus;
  role: string;
}

export interface RegistrationTeacherI {
  name: { type: string; required: true };
  email: { type: string; required: true; unique: true };
  username: { type: string; required: true; unique: true };
  password: { type: string; required: true };
  status: RegistrationStatus;
  role: string;
}
const RegistrationStudentSchema = new mongoose.Schema<RegistrationStudentI>({
  name: String,
  email: String,
  username: String,
  password: String,
  status: { type: String, enum: Object.values(RegistrationStatus) },
  role: { type: String, default: "student" },
});

const RegistrationTeacherSchema = new mongoose.Schema<RegistrationTeacherI>({
  name: String,
  email: String,
  username: String,
  password: String,
  status: { type: String, enum: Object.values(RegistrationStatus) },
  role: { type: String, default: "teacher" },
});
export const RegistrationStudentModel = mongoose.model<RegistrationStudentI>(
  "student-registration",
  RegistrationStudentSchema
);

export const RegistrationTeacherModel = mongoose.model<RegistrationTeacherI>(
  "teacher-registration",
  RegistrationTeacherSchema
);
