import express from "express";
import {
  allBounties,
  cancelSubmissions,
  getBalance,
  loginStudent,
  registerStudent,
  reSubmit,
  submitBounty,
  updatePassword,
} from "../controllers/student.controllers";
const studentRoutes = express.Router();

studentRoutes.post("/login", loginStudent);
studentRoutes.post("/register", registerStudent);

studentRoutes.get("/bounties", allBounties);
studentRoutes.post("/submit/:bountyId", submitBounty);
studentRoutes.delete("/cancelSubmissions/:bountyId", cancelSubmissions);
studentRoutes.put("/resubmit/:bountyId", reSubmit);
studentRoutes.get("/getBalance", getBalance);
studentRoutes.put("/password", updatePassword);
export default studentRoutes;
