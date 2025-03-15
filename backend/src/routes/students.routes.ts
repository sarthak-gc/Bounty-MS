import express from "express";
import {
  allBounties,
  cancelSubmissions,
  getAllSubmissions,
  getBalance,
  getSubmissionStatus,
  loginStudent,
  registerStudent,
  reSubmit,
  submitBounty,
  updatePassword,
  individualBounty,
  individualSubmission,
} from "../controllers/student.controllers";
import authMiddleware from "../middlewares/authmiddleware";
const studentRoutes = express.Router();

studentRoutes.post("/login", loginStudent);
studentRoutes.post("/register", registerStudent);

studentRoutes.use(authMiddleware);
studentRoutes.get("/bounties", allBounties);
studentRoutes.get("/bounty/:bountyId", individualBounty);
studentRoutes.post("/submit/:bountyId", submitBounty);
studentRoutes.put("/cancelSubmission/:bountyId", cancelSubmissions);
studentRoutes.get("/individual-submission/:submissionId", individualSubmission);
studentRoutes.put("/resubmit/:bountyId", reSubmit);
studentRoutes.get("/balance", getBalance);
studentRoutes.get("/submissions/", getAllSubmissions);
studentRoutes.get("/submissions/:bountyId", getSubmissionStatus);
studentRoutes.put("/password", updatePassword);
export default studentRoutes;
