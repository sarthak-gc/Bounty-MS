import { Request, Response } from "express";
// import * as jwt from "jsonwebtoken";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { bountyModel, BountyStatus } from "../models/bounty.model";
import {
  BountySubmissionStatus,
  submissionModel,
} from "../models/submissions.model";
import { balanceModel } from "../models/balance.model";
import { studentModel } from "../models/student.model";

const allBounties = async (req: Request, res: Response) => {
  const bounties = await bountyModel.find({});
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

const submitBounty = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { bountyId } = req.params;

  //since multer is not set, doing this to prevent errors
  // const { file } = req;
  const file: any = {};
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel.findOne({ _id: bountyId });

  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }

  if (bounty.status === BountyStatus.Paid) {
    res
      .status(400)
      .json({ status: "error", message: "Bounty is claimed. You are late" });
    return;
  }
  if (bounty.status === BountyStatus.Expired) {
    res.status(400).json({
      status: "error",
      message: "Bounty is expired. No body calimed it",
    });
    return;
  }

  if (bounty.status === BountyStatus.Paused) {
    res.status(400).json({
      status: "error",
      message:
        "Submissions are paused. You cannot submit answers or cancel your submissions for now. Try again when it's open",
    });
    return;
  }
  if (bounty.status !== BountyStatus.Open) {
    res.status(400).json({
      status: "error",
      message: "Invalid status, Internal Error",
    });
    return;
  }

  const answer = {
    fileName: file.originalname,
    path: file.path,
    mimeType: file.mimetype,
    size: file.size,
  };
  const bountyAlreadyApplied = await submissionModel.findOne({
    bountyId: bounty._id,
    submission: userId,
    // "answer.fileName": { $ne: "" },
    // "answer.path": { $ne: "" },
    // "answer.mimeType": { $ne: "" },
    // "answer.size": { $ne: 0 },
  });

  if (bountyAlreadyApplied) {
    res.status(400).json({
      status: "error",
      message:
        "You have already submitted your answers for this bounty. Cancel it to resubmit",
    });
    return;
  }

  const newBounty = await submissionModel.create({
    bountyId: bounty._id,
    submission: userId,
    status: BountySubmissionStatus.FirstSubmission,
    // answer,
  });

  if (!newBounty) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to create bounty. Try again" });
    return;
  }

  await bountyModel.findOneAndUpdate(
    { _id: bountyId },
    {
      $push: { submissions: newBounty._id },
    },
    { new: true }
  );
  res.json({ message: "Bounty Submitted" });
};

const cancelSubmissions = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { bountyId } = req.params;

  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel.findOne({ _id: bountyId });

  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }

  if (bounty.status === BountyStatus.Paid) {
    res
      .status(400)
      .json({ status: "error", message: "Bounty is claimed. You are late" });
    return;
  }
  if (bounty.status === BountyStatus.Expired) {
    res.status(400).json({
      status: "error",
      message: "Bounty is expired. No point of cancelling it",
    });
    return;
  }

  if (bounty.status === BountyStatus.Paused) {
    res.status(400).json({
      status: "error",
      message:
        "Submissions are paused. You cannot submit answers or cancel your submissions for now. Try again when it's open",
    });
    return;
  }
  if (bounty.status !== BountyStatus.Open) {
    res.status(400).json({
      status: "error",
      message: "Invalid status, Internal Error",
    });
    return;
  }

  const submissions = await submissionModel.find({
    bountyId: bounty._id,
    submission: userId,
    status: {
      $in: [
        BountySubmissionStatus.Rejected,
        BountySubmissionStatus.FirstSubmission,
        BountySubmissionStatus.Resubmission,
      ],
    },
  });

  if (submissions.length === 0) {
    res.status(404).json({ status: "error", message: "No submissions found" });
    return;
  }

  await submissionModel.deleteOne({
    bountyId: bounty._id,
    submission: userId,
  });

  res.json({ message: "Bounty submission cancelled" });
};

const reSubmit = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { bountyId } = req.params;

  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel.findOne({ _id: bountyId });

  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }

  if (bounty.status === BountyStatus.Paid) {
    res
      .status(400)
      .json({ status: "error", message: "Bounty is claimed. You are late" });
    return;
  }
  if (bounty.status === BountyStatus.Expired) {
    res.status(400).json({
      status: "error",
      message: "Bounty is expired. No body calimed it",
    });
    return;
  }

  if (bounty.status === BountyStatus.Paused) {
    res.status(400).json({
      status: "error",
      message:
        "Submissions are paused. You cannot submit answers or cancel your submissions for now. Try again when it's open",
    });
    return;
  }
  if (bounty.status !== BountyStatus.Open) {
    res.status(400).json({
      status: "error",
      message: "Invalid status, Internal Error",
    });
    return;
  }

  const bountyAlreadyApplied = await submissionModel.findOne({
    bountyId: bounty._id,
    submission: userId,
  });

  if (bountyAlreadyApplied) {
    res.status(400).json({
      status: "error",
      message: "You have already submitted for this bounty",
    });
    return;
  }

  const newBounty = await submissionModel.create({
    bountyId: bounty._id,
    submission: userId,
    status: BountySubmissionStatus.FirstSubmission,
  });

  if (!newBounty) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to create bounty. Try again" });
    return;
  }

  await bountyModel.findOneAndUpdate(
    { _id: bountyId },
    {
      $push: { submissions: newBounty._id },
    },
    { new: true }
  );
  res.json({ message: "Bounty Submitted" });
};

const getBalance = async (req: Request, res: Response) => {
  const balance = await balanceModel.findOne({ userId: req.user.id });

  if (!balance) {
    res.status(404).json({ status: "error", message: "No balance found" });
    return;
  }

  res.json({
    status: "success",
    message: "TotalBalance",
    data: {
      balance: balance.balance,
    },
  });
};

const registerStudent = async (req: Request, res: Response) => {
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

  const student = await studentModel.create({
    name,
    email: normalizedEmail,
    username,
    password,
  });
  if (!student) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to register. Try again" });
    return;
  }

  res.json({
    staus: "success",
    message: "Registered successfull",
    data: {
      registeredUser: student,
    },
  });
};

const loginStudent = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ status: "error", message: "Email and password are required" });
    return;
  }

  const userExists = await studentModel.findOne({ email });
  if (!userExists) {
    res.status(404).json({ status: "error", message: "User not found" });
    return;
  }

  if (!userExists.password === password) {
    res.status(401).json({ status: "error", message: "Invalid credentials" });
    return;
  }
  const token = jwt.sign(
    { id: userExists._id, role: "student" },
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
export {
  allBounties,
  submitBounty,
  cancelSubmissions,
  reSubmit,
  getBalance,
  registerStudent,
  loginStudent,
};
