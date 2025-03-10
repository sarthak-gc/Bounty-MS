import { Request, Response } from "express";
import { bountyModel, BountyStatus } from "../models/bounty.model";
import { studentModel } from "../models/student.model";
import {
  RegistrationStatus,
  RegistrationStudentModel,
  RegistrationTeacherModel,
} from "../models/registration.model";
import { teacherModel } from "../models/teacher.model";
import { balanceModel } from "../models/balance.model";
import * as jwt from "jsonwebtoken";
import { notificationModel } from "../models/notification.model";
import {
  deleteStudent,
  deleteTeacher,
  getStudentRegistrations,
  getTeacherRegistrations,
  verifyStudent,
  verifyTeacher,
} from "../utils/admin.utils";
import { submissionModel } from "../models/submissions.model";
import { model } from "mongoose";

const secret = process.env.JWT_SECRET as string;

const allBounties = async (req: Request, res: Response) => {
  const bounties = await bountyModel
    .find({})
    .populate("teacherId", "name email")
    .populate("studentId", "name email ");
  if (bounties.length > 0) {
    res.json({
      status: "success",
      message: "Bounties Received",
      data: {
        bounties,
      },
    });
    return;
  } else {
    res.status(404).json({
      status: "success",
      message: "No Bounties Found",
      data: { bounties: [] },
    });
    return;
  }
};

const pauseSubmissions = async (req: Request, res: Response) => {
  const { bountyId } = req.params;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel.findOne({ _id: bountyId });
  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty  not found" });
  }

  switch (bounty?.status) {
    case BountyStatus.Open:
      const bounty = await bountyModel.findOneAndUpdate(
        { _id: bountyId },
        { status: BountyStatus.Paused }
      );
      if (!bounty) {
        res.status(404).json({ status: "error", message: "Bounty not found" });
        return;
      }
      res.json({
        status: "success",
        message: "Submissions paused successfully",
        data: { bounty },
      });
    case BountyStatus.Paid:
      res
        .status(400)
        .json({ status: "error", message: "Bounty is already paid" });
      return;
    case BountyStatus.Expired:
      res.status(400).json({
        status: "error",
        message: "Bounty is expired. No submissions can be paused",
      });
      return;
    case BountyStatus.Paused:
      res
        .status(400)
        .json({ status: "error", message: "Bounty is already paused" });

    default:
      res.status(400).json({
        status: "error",
        message: "Invalid status for pausing submissions",
      });
      return;
  }
};

const verifyRegistrations = async (req: Request, res: Response) => {
  const { registrationId } = req.params;
  const { role } = req.body;
  if (!registrationId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  if (!role) {
    res.status(400).json({ status: "error", message: "Role is needed" });
    return;
  }

  if (role === "teacher") {
    await verifyTeacher(registrationId, res);
  } else if (role === "student") {
    await verifyStudent(registrationId, res);
  } else {
    res.json({ status: "error", message: "Invalid role" });
    return;
  }
};

const rejectRegistrations = async (req: Request, res: Response) => {
  const { registrationId } = req.params;
  const { role } = req.body;

  if (!registrationId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  if (!role) {
    res.status(400).json({ status: "error", message: "Role is needed" });
    return;
  }

  if (role === "teacher") {
    await RegistrationTeacherModel.findByIdAndDelete(registrationId);
  } else if (role === "student") {
    await RegistrationStudentModel.findByIdAndDelete(registrationId);
  } else {
    res.json({ status: "error", message: "Invalid role" });
    return;
  }

  res.json({
    status: "success",
    message: "User Registration rejected",
  });
};

const deleteUsers = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }

  const { role } = req.body;

  if (role === "student") {
    await deleteStudent(userId, res);
  } else if (role === "teacher") {
    await deleteTeacher(userId, res);
  } else {
    res.status(403).json({ status: "error", message: "Role required" });
    return;
  }
};

const addTeacherBalance = async (req: Request, res: Response) => {
  const { teacherId } = req.params;
  const { balance } = req.body;
  if (!teacherId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  if (!balance) {
    res.status(400).json({ status: "error", message: "Balance is needed" });
    return;
  }
  if (balance % 1 !== 0) {
    res
      .status(400)
      .json({ status: "error", message: "Balance must be a whole number" });
    return;
  }

  if (balance < 10) {
    res.status(403).json({
      status: "error",
      message: "balance must be greater or equal to 10",
    });
  }
  const teacher = await balanceModel.findOne({ userId: teacherId });

  if (!teacher) {
    await balanceModel.create({ role: "teacher", userId: teacherId, balance });
    res.json({
      status: "success",
      message: "Added Balance to teacher's Account",
    });
    return;
  }

  const updatedTeacher = await balanceModel.findOneAndUpdate(
    { userId: teacher.userId },
    { $inc: { balance } },
    { new: true }
  );

  if (!updatedTeacher) {
    res.status(500).json({ status: "error", message: "Internal Server Error" });
    return;
  }

  res.json({
    status: "success",
    message: "Added Balance to teacher's Account",
  });
};

const removeBounty = async (req: Request, res: Response) => {
  const { bountyId } = req.params;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel.findOneAndDelete({ _id: bountyId });
  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }
  res.json({ status: "success", message: "Bounty deleted successfully" });
};

const getAllRegistrations = async (req: Request, res: Response) => {
  const teachers = await getTeacherRegistrations();
  const students = await getStudentRegistrations();

  if (teachers.length === 0 && students.length === 0) {
    res.status(404).json({
      status: "success",
      message: "No Registrations Found",
      data: { teachers: [], students: [] },
    });

    return;
  } else {
    res.json({
      status: "success",
      message: "Registrations Received",
      data: {
        teachers,
        students,
      },
    });
    return;
  }
};

const adminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username !== process.env.ADMIN_USERNAME) {
    res.status(401).json({ status: "error", message: "Invalid username" });
    return;
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ status: "error", message: "Invalid password" });
    return;
  }
  const token = jwt.sign({ username, password }, secret);
  res.json({
    status: "success",
    message: "Admin Login Successful",
    data: {
      token,
    },
  });
};

const getUser = async (req: Request, res: Response) => {
  const { userId, role } = req.params;
  if (!userId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  if (role === "teacher") {
    const user = await teacherModel.findById(userId);
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }
    res.json({
      status: "success",
      message: "User retrieved successfully",
      data: { user },
    });
    return;
  } else if (role === "student") {
    const user = await studentModel.findById(userId);
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }
    res.json({
      status: "success",
      message: "User retrieved successfully",
      data: { user },
    });
    return;
  } else {
    res.status(400).json({ status: "error", message: "No role to search" });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const students = await studentModel.find({}).select("-password");
  const teachers = await teacherModel.find({}).select("-password");
  if (students.length < 0 && teachers.length < 0) {
    res.status(404).json({
      status: "success",
      message: "No Users Found",
      data: { students: [], teachers: [] },
    });
    return;
  }
  res.json({
    status: "success",
    message: "Users retrieved successfully",
    data: { students, teachers },
  });
};

const viewIndividualBounty = async (req: Request, res: Response) => {
  const { bountyId } = req.params;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel
    .findById(bountyId)
    .populate({
      path: "submissions",
      model: "submission",
      populate: [
        {
          path: "submission",
          model: "student",
          select: "name email",
        },
      ],
    })
    .populate("teacherId", "name email")
    .exec();

  // .exec();

  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }
  res.json({
    status: "success",
    message: "Bounty retrieved successfully",
    data: { bounty },
  });
};

const updatePassword = async (req: Request, res: Response) => {
  const { newPassword, role } = req.body;
  const { userId } = req.params;
  if (!newPassword) {
    res.status(400).json({ status: "error", message: "Password is needed" });
    return;
  }

  let updatedPassword;
  if (!role) {
    res.status(404).json({ status: "error", message: "Role necessary" });
    return;
  }

  if (role === "student") {
    updatedPassword = await studentModel.findOneAndUpdate(
      { _id: userId },
      { password: newPassword },
      { new: true }
    );
  } else if (role === "teacher") {
    updatedPassword = await teacherModel.findOneAndUpdate(
      { _id: userId },
      { password: newPassword },
      { new: true }
    );
  } else {
    res.status(400).json({ status: "error", message: "Invalid user role" });
    return;
  }

  if (!updatedPassword) {
    res.status(404).json({ status: "error", message: "User Not Found" });
    return;
  }
  res.json({
    status: "success",
    message: "Password updated successfully",
  });
};

const sendNotifications = async (req: Request, res: Response) => {
  const { message, recipient } = req.body;
  let to;
  if (!message) {
    res.status(400).json({ status: "error", message: "Message needed" });
    return;
  }

  if (recipient) {
    to = recipient;
  } else {
    to = "everyone";
  }
  const notification = await notificationModel.create({
    postedBy: "admin",
    message,
    to,
  });
  if (!notification) {
    res.status(500).json({ status: "error", message: "Internal Server Error" });
    return;
  }
  res.json({
    status: "success",
    message: "Notification sent successfully",
  });
};
const getTeacherBounty = async (req: Request, res: Response) => {
  const { teacherId } = req.params;
  if (!teacherId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounties = await bountyModel.find({ teacherId });

  if (bounties.length < 0) {
    res.status(404).json({
      status: "success",
      message: "No Bounties Found",
      data: { bounties: [] },
    });
    return;
  }
  res.json({
    status: "success",
    message: "Bounties retrieved successfully",
    data: { bounties },
  });
};

const getTeacherBalance = async (req: Request, res: Response) => {
  const { teacherId } = req.params;

  if (!teacherId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const balance = await balanceModel.findOne({
    userId: teacherId,
  });

  if (!balance) {
    res.status(404).json({ status: "error", message: "Balance not found" });
    return;
  }
  res.json({
    status: "success",
    message: "Balance retrieved successfully",
    data: { balance: balance.balance },
  });
};
const getUserSubmissions = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const submissions = await submissionModel
    .find({ submission: userId })
    .populate("bountyId", "question price");

  if (submissions.length < 0) {
    res.status(404).json({
      status: "success",
      message: "No Submissions Found",
      data: { submissions: [] },
    });
    return;
  }

  res.json({
    status: "success",
    message: "Submissions retrieved successfully",
    data: { submissions },
  });
};
export {
  allBounties,
  getUser,
  removeBounty,
  pauseSubmissions,
  verifyRegistrations,
  deleteUsers,
  addTeacherBalance,
  getAllRegistrations,
  adminLogin,
  getAllUsers,
  viewIndividualBounty,
  updatePassword,
  sendNotifications,
  rejectRegistrations,
  getTeacherBounty,
  getTeacherBalance,
  getUserSubmissions,
};
