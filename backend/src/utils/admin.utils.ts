import { Response } from "express";
import {
  RegistrationStatus,
  RegistrationStudentModel,
  RegistrationTeacherModel,
} from "../models/registration.model";
import { teacherModel } from "../models/teacher.model";
import { studentModel } from "../models/student.model";

export const verifyTeacher = async (id: string, res: Response) => {
  const user = await RegistrationTeacherModel.findOne({
    _id: id,
    status: RegistrationStatus.Pending,
  });

  if (!user) {
    res.status(404).json({ status: "error", message: "User not found" });
    return;
  }
  const newUser = await teacherModel.create({
    name: user.name,
    email: user.email,
    username: user.username,
    password: user.password,
  });
  await RegistrationTeacherModel.findByIdAndDelete(id);
  res.json({
    status: "success",
    message: "Teacher verified",
    data: { user: newUser },
  });
  return;
};

export const verifyStudent = async (id: string, res: Response) => {
  const user = await RegistrationStudentModel.findOne({
    _id: id,
    status: RegistrationStatus.Pending,
  });
  if (!user) {
    res.status(404).json({ status: "error", message: "User not found" });
    return;
  }
  const newUser = await studentModel.create({
    name: user.name,
    email: user.email,
    username: user.username,
    password: user.password,
  });
  await RegistrationStudentModel.findByIdAndDelete(id);
  res.json({
    status: "success",
    message: "Student verified",
    data: { user: newUser },
  });
  return;
};

export const deleteStudent = async (userId: string, res: Response) => {
  const user = await studentModel.findOneAndDelete({ _id: userId });
  if (!user) {
    res.status(404).json({ status: "error", message: "User not found" });
    return;
  }

  res.json({
    status: "success",
    message: "User deleted successfully",
    data: {
      deletedUser: user,
    },
  });
  return;
};

export const deleteTeacher = async (userId: string, res: Response) => {
  const user = await teacherModel.findOneAndDelete({ _id: userId });
  if (!user) {
    res.status(404).json({ status: "error", message: "User not found" });
    return;
  }

  res.json({
    status: "success",
    message: "User deleted successfully",
    data: {
      deletedUser: user,
    },
  });
  return;
};

export const getTeacherRegistrations = async () => {
  const teacherRegistrations = await RegistrationTeacherModel.find({
    status: RegistrationStatus.Pending,
  });

  if (teacherRegistrations.length === 0) {
    return [];
  } else {
    return teacherRegistrations;
  }
};
export const getStudentRegistrations = async () => {
  const studentRegistrations = await RegistrationStudentModel.find({
    status: RegistrationStatus.Pending,
  });

  if (studentRegistrations.length === 0) {
    return [];
  } else {
    return studentRegistrations;
  }
};
