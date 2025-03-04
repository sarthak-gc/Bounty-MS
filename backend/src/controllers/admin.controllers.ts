import { Request, Response } from "express";

const allBounties = (req: Request, res: Response) => {
  console.log("All bounties");
  res.json({ message: "All bounties" });
};

const pauseSubmissions = (req: Request, res: Response) => {
  console.log("Submissions Paused");
  res.json({ message: "Submissions Paused" });
};

const verifyRegistrations = (req: Request, res: Response) => {
  console.log("Registratations");
  res.json({ message: " Registrations" });
};

const deleteUsers = (req: Request, res: Response) => {
  console.log("User Deleted");
  res.json({ message: " User Deleted" });
};

const addTeacherBalance = (req: Request, res: Response) => {
  console.log("Added Balance to teacher's Account");
  res.json({ message: "Added Balance to teacher's Account" });
};

export {
  allBounties,
  pauseSubmissions,
  verifyRegistrations,
  deleteUsers,
  addTeacherBalance,
};
