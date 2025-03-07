import { Response } from "express";
import { balanceModel } from "../models/balance.model";
import { teacherModel } from "../models/teacher.model";

export const addBalance = async (
  amount: number,
  studentId: string,
  teacherId: string
) => {
  const existingBalance = await balanceModel.findOne({ userId: studentId });

  if (!existingBalance) {
    await balanceModel.create({
      userId: studentId,
      balance: amount,
      role: "student",
    });
    return { status: "success", message: "Balance updated successfully" };
  } else {
    const updatedUser = await balanceModel.findOneAndUpdate(
      { userId: studentId },
      { $inc: { balance: amount } },
      { new: true }
    );

    const test = await balanceModel.findOneAndUpdate(
      { userId: teacherId },
      {
        $inc: { balance: -amount },
      },
      { new: true }
    );
    console.log(test, " Money");
    if (!updatedUser) {
      return { status: "error", message: "Failed to update balance" };
    }
    return { status: "success", message: "Balance updated successfully" };
  }
};

export const validateDetails = (
  name: string,
  email: string,
  username: string,
  password: string,
  role: string,
  res: Response
) => {
  if (!name.trim()) {
    res.status(400).json({ status: "error", message: "Name is required" });
    return false;
  }
  if (!email.trim()) {
    res.status(400).json({ status: "error", message: "Email is required" });
    return false;
  }

  if (!role.trim() || role !== "teacher") {
    res.status(400).json({ status: "error", message: "Invalid role" });
    return false;
  }

  if (username.trim().length < 4) {
    res.status(400).json({
      status: "error",
      message: "Username must be at least 4 characters long",
    });
    return false;
  }

  if (password.trim().length < 6) {
    res.status(400).json({
      status: "error",
      message: "Password must be at least 6 characters long",
    });
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ status: "error", message: "Invalid email format" });
    return false;
  }
  return true;
};
