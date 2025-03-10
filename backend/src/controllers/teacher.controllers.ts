import { Request, Response } from "express";
import { bountyModel, BountyStatus } from "../models/bounty.model";
import { teacherModel } from "../models/teacher.model";
import * as jwt from "jsonwebtoken";
import {
  BountySubmissionStatus,
  submissionModel,
} from "../models/submissions.model";
import {
  RegistrationStatus,
  RegistrationTeacherModel,
} from "../models/registration.model";
import { studentModel } from "../models/student.model";
import { addBalance } from "../utils/teacher.utils";
import { validateDetails } from "../utils/teacher.utils";
import cron from "node-cron";

cron.schedule("*/10 * * * * * *", async () => {
  const currentDate = new Date();

  await bountyModel.updateMany(
    {
      expiryDate: { $lt: currentDate },
      status: BountyStatus.Open,
    },
    { status: BountyStatus.Expired }
  );
});

const addBounty = async (req: Request, res: Response) => {
  if (req.user.role !== "teacher") {
    res.status(403).json({ status: "error", message: "Unauthorized" });
    return;
  }
  const { bountyQuestion, price, timeInMinutes } = req.body;
  if (!bountyQuestion) {
    res.status(400).json({ status: "error", message: "Question is required" });
    return;
  }
  if (!price || price < 10) {
    res
      .status(400)
      .json({ status: "error", message: "Price must be greater than 10 " });
    return;
  }
  const newBounty = await bountyModel.create({
    question: bountyQuestion,
    teacherId: req.user.id,
    status: BountyStatus.Open,
    price,
    expiryDate: new Date(Date.now() + timeInMinutes * 60 * 1000),
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
  const { bountyId } = req.params;

  const { amount, studentId } = req.body;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }

  const bountyAlreadyPaid = await bountyModel.findOne({
    teacherId: req.user.id,
    _id: bountyId,
    status: BountyStatus.Paid,
  });

  if (bountyAlreadyPaid) {
    res.status(409).json({ status: "error", message: "Bounty already paid" });
    return;
  }
  const submission1 = await submissionModel.findOne({
    bountyId,
    submission: studentId,
  });
  if (!submission1) {
    res.status(404).json({ status: "error", message: "No submissions found" });
    return;
  }
  const bounty = await bountyModel.findOneAndUpdate(
    {
      _id: bountyId,
      status: { $in: [BountyStatus.Open, BountyStatus.Paused] },
      teacherId: req.user.id,
    },
    { status: BountyStatus.Paid, studentId },
    {
      new: true,
    }
  );

  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }
  const submission = await submissionModel.findOneAndUpdate(
    {
      bountyId,
      submission: studentId,
      status: BountySubmissionStatus.Submitted,
    },
    {
      accepetedBy: req.user.id,
      status: BountySubmissionStatus.Approved,
    },
    { new: true }
  );

  if (!submission) {
    res.status(404).json({ status: "error", message: "Student not found" });
    return;
  }

  const balanceAdded = await addBalance(
    amount,
    studentId,
    req.user.id as string
  );

  if (!balanceAdded) {
    res.status(500).json({ status: "error", message: "Internal Error" });
    return;
  }

  res.json({
    status: "success",
    message: `Bounty marked as completed and balance sent to ${studentId}`,
  });
};

const rejectBountyRequest = async (req: Request, res: Response) => {
  const { bountyId } = req.params;
  const { studentId } = req.body;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }

  const updateSubmission = await submissionModel.findOneAndUpdate(
    {
      bountyId,
      submission: studentId,
      status: BountySubmissionStatus.Submitted,
    },
    { status: BountySubmissionStatus.Rejected, rejectedBy: req.user.id }
  );

  if (!updateSubmission) {
    res.status(404).json({ status: "error", message: "Invalid Request" });
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
    {
      _id: bountyId,
      status: { $in: [BountyStatus.Open, BountyStatus.Paused] },
      teacherId: req.user.id,
    },
    { status: BountyStatus.Paused }
  );

  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }

  if (bounty.status === BountyStatus.Paused) {
    res
      .status(400)
      .json({ status: "error", message: "Bounty is already paused" });
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
  const areDetailsValid = await validateDetails(
    name,
    email,
    username,
    password,
    role,
    res
  );

  if (!areDetailsValid) {
    return;
  }
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser =
    (await RegistrationTeacherModel.findOne({
      email: normalizedEmail,
    })) || (await teacherModel.findOne({ email }));
  if (existingUser) {
    res.status(400).json({
      status: "error",
      message: "Email already exists. Please use a different email",
    });
    return;
  }

  const teacher = await RegistrationTeacherModel.create({
    name,
    email: normalizedEmail,
    username,
    password,
    status: RegistrationStatus.Pending,
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

const currentBounties = async (req: Request, res: Response) => {
  const bounties = await bountyModel.find({
    teacherId: req.user.id,
    status: {
      $in: [BountyStatus.Open, BountyStatus.Paused],
    },
  });
  if (bounties.length === 0) {
    res.json({
      status: "success",
      message: "Bounties Received",
      data: { bounties: [] },
    });
  }
  res.json({
    status: "success",
    message: "Bounties Received",
    data: { bounties },
  });
  return;
};

const studentSubmissions = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const submissions = await submissionModel.find({
    submission: studentId,
    status: BountySubmissionStatus.Submitted,
  });
  res.json({ status: "success", data: submissions });
};

const viewStudents = async (req: Request, res: Response) => {
  const students = await studentModel
    .find({
      role: "student",
    })
    .select("name email username -_id");

  if (students.length === 0) {
    res.status(404).json({
      status: "status",
      message: "No students found",
      data: { students: [] },
    });
    return;
  }
  res.json({
    status: "success",
    message: "Users Received",
    data: { students },
  });
};

const viewIndividualStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const student = await studentModel
    .findById(studentId)
    .select("name email username -_id");

  if (!student) {
    res.status(404).json({ status: "error", message: "Student not found" });
    return;
  }

  res.json({
    status: "success",
    message: "Student Details Received",
    data: { student },
  });
};

const viewIndividualBounty = async (req: Request, res: Response) => {
  const { bountyId } = req.params;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel.findById(bountyId);
  if (
    !bounty ||
    (bounty.status !== BountyStatus.Open &&
      bounty.status !== BountyStatus.Paused)
  ) {
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
  const { newPassword } = req.body;

  if (!newPassword.trim()) {
    res
      .status(400)
      .json({ status: "error", message: "New password is required" });
    return;
  }

  const user = await teacherModel.findByIdAndUpdate(
    req.user.id,
    { password: newPassword },
    { new: true }
  );

  if (!user) {
    res.status(404).json({ status: "error", message: "User not found" });
    return;
  }

  res.json({
    status: "success",
    message: "Password updated successfully",
    data: { user },
  });
};

const resumeSubmissions = async (req: Request, res: Response) => {
  const { bountyId } = req.params;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel.findOneAndUpdate(
    {
      _id: bountyId,
      status: { $in: [BountyStatus.Open, BountyStatus.Paused] },
      teacherId: req.user.id,
    },
    { status: BountyStatus.Open }
  );

  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }

  if (bounty.status === BountyStatus.Open) {
    res
      .status(400)
      .json({ status: "error", message: "Bounty is already open" });
    return;
  }
  res.json({ status: "success", message: "Bounty submissios resumed" });
};
export {
  updatePassword,
  addBounty,
  removeBounty,
  markBountyAsCompleted,
  viewIndividualStudent,
  rejectBountyRequest,
  pauseSubmissions,
  loginTeacher,
  registerTeacher,
  currentBounties,
  studentSubmissions,
  viewStudents,
  viewIndividualBounty,
  resumeSubmissions,
};
