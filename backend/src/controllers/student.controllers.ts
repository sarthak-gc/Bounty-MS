import { Request, Response } from "express";
import { bountyModel } from "../models/bounty.model";

const allBounties = (req: Request, res: Response) => {
  console.log("All bounties");
  res.json({ message: "All bounties" });
};

// const inProgressBounties = (req: Request, res: Response) => {
//   console.log("In Progress Bounties");
//   res.json({ message: "In Progress Bounties" });
// };

const submitBounty = (req: Request, res: Response) => {
  console.log("Bounty Submitted");
  res.json({ message: "Bounty Submitted" });
};

const cancelSubmissions = (req: Request, res: Response) => {
  console.log("cancelled submissions");
  res.json({ message: "Bounty submission cancelled" });
};

const reSubmit = (req: Request, res: Response) => {
  console.log("Re Submitted");
  res.json({ message: "Re Submitted" });
};

const getBalance = (req: Request, res: Response) => {
  console.log("total balance");
  res.json({ message: "TotalBalance" });
};
export {
  allBounties,
  // inProgressBounties,
  submitBounty,
  cancelSubmissions,
  reSubmit,
  getBalance,
};
