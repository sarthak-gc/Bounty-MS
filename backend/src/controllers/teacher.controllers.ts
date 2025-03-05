import { Request, Response } from "express";
import { bountyModel, BountyStatus } from "../models/bounty.model";
import { teacherModel } from "../models/teacher.model";
import * as jwt from "jsonwebtoken";
import {
  BountySubmissionStatus,
  submissionModel,
} from "../models/submissions.model";
const addBounty = async (req: Request, res: Response) => {
  const { bountyQuestion } = req.body;
  if (!bountyQuestion) {
    res.status(400).json({ status: "error", message: "Question is required" });
    return;
  }

  const newBounty = await bountyModel.create({
    question: bountyQuestion,
    teacherId: req.user.id,
    status: BountyStatus.Open,
  });

  if (!newBounty) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to create bounty" });
    return;
  }
  res.status(201).json({
    status: "success",
    message: "Bounty created",
    data: { bounty: newBounty },
  });
};
const removeBounty = async (req: Request, res: Response) => {
  const { bountyId } = req.params;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel.findOneAndDelete({
    _id: bountyId,
    teacherId: req.user.id,
    status: BountyStatus.Open,
  });
  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }
  res.json({ status: "success", message: "Bounty removed" });
};

const markBountyAsCompleted = async (req: Request, res: Response) => {
  const { bountyId, studentId } = req.params;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel.findOneAndUpdate(
    { _id: bountyId },
    { status: BountyStatus.Paid }
  );

  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }
  const updateSubmission = await submissionModel.findOneAndUpdate(
    {
      bountyId,
      submission: studentId,
    },
    { status: BountySubmissionStatus.Approved },
    { new: true }
  );

  if (!updateSubmission) {
    res.status(404).json({ status: "error", message: "Student not found" });
    return;
  }
  res.json({
    status: "success",
    message: "Bounty marked as completed",
    data: {
      receiver: studentId,
    },
  });
};

const rejectBountyRequest = async (req: Request, res: Response) => {
  const { bountyId, studentId } = req.params;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const updateSubmission = await submissionModel.findOneAndUpdate(
    {
      bountyId,
      submission: studentId,
    },
    { status: BountySubmissionStatus.Rejected }
  );

  if (!updateSubmission) {
    res.status(404).json({ status: "error", message: "Student not found" });
    return;
  }
  res.json({
    status: "success",
    message: "Bounty request rejected",
  });
};

const pauseSubmissions = async (req: Request, res: Response) => {
  const { bountyId } = req.params;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel.findOneAndUpdate(
    { _id: bountyId },
    { status: BountyStatus.Paused }
  );

  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }
  res.json({ status: "success", message: "Bounty  paused for now" });
};

const loginTeacher = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ status: "error", message: "Email and password are required" });
    return;
  }

  if (role != "teacher") {
    res.status(400).json({ status: "error", message: "Invalid role" });
    return;
  }

  const userExists = await teacherModel.findOne({ email });
  if (!userExists) {
    res.status(404).json({ status: "error", message: "User not found" });
    return;
  }

  if (userExists.password != password) {
    res.status(401).json({ status: "error", message: "Invalid credentials" });
    return;
  }
  const token = jwt.sign(
    { id: userExists._id, role: "teacher" },
    process.env.JWT_SECRET as string
  );
  res.json({
    status: "success",
    message: "Logged in successfully",
    data: {
      token,
    },
  });
};

const registerTeacher = async (req: Request, res: Response) => {
  const { name, email, username, password, role } = req.body;
  if (!name.trim()) {
    res.status(400).json({ status: "error", message: "Name is required" });
    return;
  }
  if (!email.trim()) {
    res.status(400).json({ status: "error", message: "Email is required" });
    return;
  }
  if (!username.trim()) {
    res.status(400).json({ status: "error", message: "Username is required" });
    return;
  }
  if (!password.trim()) {
    res.status(400).json({ status: "error", message: "Password is required" });
    return;
  }
  if (!role.trim() || role !== "student") {
    res.status(400).json({ status: "error", message: "Invalid role" });
    return;
  }
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ status: "error", message: "Invalid email format" });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (username.trim().length < 4) {
    res.status(400).json({
      status: "error",
      message: "Username must be at least 4 characters long",
    });
    return;
  }

  if (password.trim().length < 6) {
    res.status(400).json({
      status: "error",
      message: "Password must be at least 6 characters long",
    });
    return;
  }

  const teacher = await teacherModel.create({
    name,
    email: normalizedEmail,
    username,
    password,
  });
  if (!teacher) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to register. Try again" });
    return;
  }

  res.json({
    staus: "success",
    message: "Registered successfull",
    data: {
      registeredUser: teacher,
    },
  });
};
export {
  addBounty,
  removeBounty,
  markBountyAsCompleted,
  pauseSubmissions,
  loginTeacher,
  registerTeacher,
};
