import { Response } from "express";
import { bountyI, BountyStatus } from "../models/bounty.model";

export const validateBounty = async (bounty: bountyI, res: Response) => {
  if (bounty.status === BountyStatus.Paid) {
    res
      .status(400)
      .json({ status: "error", message: "Bounty is claimed. You are late" });
    return false;
  }
  if (bounty.status === BountyStatus.Expired) {
    res.status(400).json({
      status: "error",
      message: "Bounty is expired. No body calimed it",
    });
    return false;
  }

  if (bounty.status === BountyStatus.Paused) {
    res.status(400).json({
      status: "error",
      message:
        "Submissions are paused. You cannot submit answers or cancel your submissions for now. Try again when it's open",
    });
    return false;
  }
  if (bounty.status !== BountyStatus.Open) {
    res.status(400).json({
      status: "error",
      message: "Invalid status, Internal Error",
    });
    return false;
  }
  return true;
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

  if (!role.trim() || role !== "student") {
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
