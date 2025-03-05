import express from "express";
import {
  allBounties,
  cancelSubmissions,
  getBalance,
  loginStudent,
  registerStudent,
  reSubmit,
  submitBounty,
} from "../controllers/student.controllers";
const studentRoutes = express.Router();

studentRoutes.post("/login", loginStudent);
studentRoutes.post("/register", registerStudent);

studentRoutes.get("/allBounties", allBounties);
studentRoutes.get("/cancelSubmissions", cancelSubmissions);
studentRoutes.get("/reSubmit", reSubmit);
studentRoutes.get("/getBalance", getBalance);
studentRoutes.get("/submitBounty", submitBounty);
export default studentRoutes;
