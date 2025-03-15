import { Request, response, Response } from "express";
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
import {
  RegistrationStatus,
  RegistrationStudentModel,
} from "../models/registration.model";
import { validateBounty, validateDetails } from "../utils/student.utils";

const allBounties = async (req: Request, res: Response) => {
  const bounties = await bountyModel
    .find({
      status: {
        $in: [BountyStatus.Open, BountyStatus.Paused],
      },
    })
    .select("teacherId price status expiryDate question")
    .populate("teacherId", "name");
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
  const isBountyStatusValid = await validateBounty(bounty, res);

  if (!isBountyStatusValid) {
    return;
  }

  // const answer = {
  //   fileName: file.originalname,
  //   path: file.path,
  //   mimeType: file.mimetype,
  //   size: file.size,
  // };
  const { answer } = req.body;

  if (!answer) {
    res.json({ status: "error", message: "Answer is needed" });
    return;
  }
  const bountyAlreadyApplied = await submissionModel.findOne({
    bountyId: bounty._id,
    submission: userId,
    status: BountySubmissionStatus.Submitted,
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
    status: BountySubmissionStatus.Submitted,
    answer,
  });

  if (!newBounty) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to submit. Try again" });
    return;
  }

  await bountyModel.findOneAndUpdate(
    { _id: bountyId },
    {
      $push: { submissions: newBounty._id },
    },
    { new: true }
  );
  res.json({ status: "success", message: "Bounty Submitted" });
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

  const isBountyStatusValid = validateBounty(bounty, res);
  if (!isBountyStatusValid) {
    return;
  }

  const submissions = await submissionModel.find({
    bountyId: bounty._id,
    submission: userId,
    status: BountySubmissionStatus.Submitted,
  });

  if (submissions.length === 0) {
    res.status(404).json({ status: "error", message: "No submissions found" });
    return;
  }

  await submissionModel.findOneAndUpdate(
    {
      bountyId: bounty._id,
      submission: userId,
    },
    { status: BountySubmissionStatus.Cancelled }
  );

  res.json({ status: "success", message: "No submissions found" });
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

  const isBountyStatusValid = validateBounty(bounty, res);
  if (!isBountyStatusValid) {
    return;
  }

  const bountyAlreadyApplied = await submissionModel.findOne({
    bountyId: bounty._id,
    submission: userId,
    status: BountySubmissionStatus.Submitted,
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
    status: BountySubmissionStatus.Submitted,
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
  const userId = req.user.id;
  const balance = await balanceModel.findOne({ userId });

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
    (await RegistrationStudentModel.findOne({
      email: normalizedEmail,
    })) || (await studentModel.findOne({ email }));
  if (existingUser) {
    res.status(400).json({
      status: "error",
      message: "Email already exists. Please use a different email",
    });
    return;
  }
  const student = await RegistrationStudentModel.create({
    name,
    email: normalizedEmail,
    username,
    password,
    status: RegistrationStatus.Pending,
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
const updatePassword = async (req: Request, res: Response) => {
  const { newPassword } = req.body;

  if (!newPassword.trim()) {
    res
      .status(400)
      .json({ status: "error", message: "New password is required" });
    return;
  }

  const user = await studentModel.findByIdAndUpdate(
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

const getAllSubmissions = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const submissions = await submissionModel
    .find({
      submission: userId,
    })
    .select("bountyId status answer ")
    .populate("bountyId", "question status price");
  if (submissions.length === 0) {
    res.status(404).json({ status: "error", message: "No submissions found" });
    return;
  }

  res.json({
    status: "success",
    message: "Submissions",
    data: { submissions },
  });
};

const getSubmissionStatus = async (req: Request, res: Response) => {
  const submissionId = req.user.id;

  if (!submissionId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }

  const submission = await submissionModel
    .find({ submission: submissionId })
    .select("bountyId status accepetedBy rejectedBy");

  if (!submission) {
    res.status(404).json({ status: "error", message: "Submission not found" });
    return;
  }

  res.json({
    status: "success",
    message: "Submission",
    data: { submission },
  });
};

const individualBounty = async (req: Request, res: Response) => {
  const { bountyId } = req.params;

  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }

  const bounty = await bountyModel
    .findOne({
      _id: bountyId,
      status: {
        $in: [BountyStatus.Open, BountyStatus.Paused],
      },
    })
    .select("question status price expiryDate");

  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty not found" });
    return;
  }

  res.json({
    status: "success",
    message: "Bounty found",
    data: {
      bounty,
    },
  });
};

const individualSubmission = async (req: Request, res: Response) => {
  const { submissionId } = req.params;
  const submissionDetails = await submissionModel
    .findById(submissionId)
    .populate("bountyId", "question");
  if (!submissionDetails) {
    res.status(404).json({ status: "error", message: "Submission not found" });
    return;
  }
  res.json({
    status: "success",
    message: "Submission found",
    data: { submissionDetails },
  });
};
export {
  updatePassword,
  allBounties,
  submitBounty,
  cancelSubmissions,
  reSubmit,
  getBalance,
  registerStudent,
  loginStudent,
  getAllSubmissions,
  getSubmissionStatus,
  individualBounty,
  individualSubmission,
};
