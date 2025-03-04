import { Request, Response } from "express";
import { bountyModel } from "../models/bounty.model";

const addBounty = (req: Request, res: Response) => {
  console.log("bouty added");
  res.json({ message: "bouty added" });
};
const removeBounty = (req: Request, res: Response) => {
  console.log("bouty added");
  res.json({ message: "bouty added" });
};

const markBountyAsCompleted = (req: Request, res: Response) => {
  console.log("marked bounty as completed");
  res.json({ message: "marked bounty as completed" });
};

const pauseSubmissions = (req: Request, res: Response) => {
  console.log("Submissions Paused");
  res.json({ message: "Submissions Paused" });
};

export { addBounty, removeBounty, markBountyAsCompleted, pauseSubmissions };
