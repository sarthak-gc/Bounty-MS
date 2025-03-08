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
} from "../controllers/student.controllers";
import authMiddleware from "../middlewares/authmiddleware";
const studentRoutes = express.Router();

studentRoutes.post("/login", loginStudent);
studentRoutes.post("/register", registerStudent);

studentRoutes.use(authMiddleware);
studentRoutes.get("/bounties", allBounties);
studentRoutes.post("/submit/:bountyId", submitBounty);
studentRoutes.delete("/cancelSubmissions/:bountyId", cancelSubmissions);
studentRoutes.put("/resubmit/:bountyId", reSubmit);
studentRoutes.get("/balance", getBalance);
studentRoutes.get("/submissions/", getAllSubmissions);
studentRoutes.get("/submissions/:bountyId", getSubmissionStatus);
studentRoutes.put("/password", updatePassword);
export default studentRoutes;
