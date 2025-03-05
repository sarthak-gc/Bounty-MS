import { Request, Response } from "express";
import { bountyModel, BountyStatus } from "../models/bounty.model";
import { studentModel } from "../models/student.model";
import {
  RegistrationStatus,
  RegistrationStudentI,
  RegistrationStudentModel,
  RegistrationTeacherModel,
} from "../models/registration.model";
import { teacherModel } from "../models/teacher.model";
import { balanceModel } from "../models/balance.model";

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

const pauseSubmissions = async (req: Request, res: Response) => {
  const { bountyId } = req.params;
  if (!bountyId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  const bounty = await bountyModel.findOneAndUpdate(
    { _id: bountyId },
    {
      status: BountyStatus.Paused,
    },
    { new: true }
  );
  if (!bounty) {
    res.status(404).json({ status: "error", message: "Bounty id not found" });
  }
  res.json({ status: "success", message: "Bounty id found", data: { bounty } });
};

const verifyRegistrations = async (req: Request, res: Response) => {
  const { registrationId } = req.params;
  const { role } = req.body;
  let user;
  if (!registrationId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  if (!role) {
    res.status(400).json({ status: "error", message: "Role is needed" });
    return;
  }
  if (role === "teacher") {
    user = await RegistrationTeacherModel.findOneAndUpdate(
      { _id: registrationId, status: RegistrationStatus.Pending },
      {
        status: RegistrationStatus.Verified,
      },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }
    res.json({
      status: "success",
      message: "User verified",
      data: { user },
    });
    return;
  } else if (role === "student") {
    user = await RegistrationStudentModel.findOneAndUpdate(
      { _id: registrationId, status: RegistrationStatus.Pending },
      {
        status: RegistrationStatus.Verified,
      },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }
    res.json({
      status: "success",
      message: "User verified",
      data: { user },
    });
    return;
  } else {
    res.json({ status: "error", message: "Invalid role" });
    return;
  }
};

const deleteUsers = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }

  const { role } = req.body;

  if (role === "student") {
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
  } else if (role === "teacher") {
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
  } else {
    res.status(403).json({ status: "error", message: "Unauthorized" });
    return;
  }
};

const addTeacherBalance = async (req: Request, res: Response) => {
  const { teacherId } = req.params;
  const { balanceAmount } = req.body;
  if (!teacherId) {
    res.status(404).json({ status: "error", message: "id is needed" });
    return;
  }
  if (!balanceAmount) {
    res.status(400).json({ status: "error", message: "Balance is needed" });
    return;
  }
  if (balanceAmount % 1 !== 0) {
    res
      .status(400)
      .json({ status: "error", message: "Balance must be a whole number" });
    return;
  }

  if (balanceAmount < 10) {
    res.status(403).json({
      status: "error",
      message: "balance must be greater or equal to 10",
    });
  }
  const teacher = await balanceModel.findOne({ userId: teacherId });

  if (!teacher) {
    res.status(404).json({ status: "error", message: "User not found" });
    return;
  }
  const updatedTeacher = await bountyModel.findOneAndUpdate(
    { userId: teacher.userId },
    { $inc: { balance: balanceAmount } },
    { new: true }
  );

  if (!updatedTeacher) {
    res.status(500).json({ status: "error", message: "Internal Server Error" });
    return;
  }

  res.json({
    message: "Added Balance to teacher's Account",
  });
};

export {
  allBounties,
  pauseSubmissions,
  verifyRegistrations,
  deleteUsers,
  addTeacherBalance,
};
