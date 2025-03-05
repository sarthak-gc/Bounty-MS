import express, { Request, Response } from "express";
import {
  addBounty,
  loginTeacher,
  markBountyAsCompleted,
  pauseSubmissions,
  registerTeacher,
  removeBounty,
} from "../controllers/teacher.controllers";
const teacherRoutes = express.Router();

teacherRoutes.post("/login", loginTeacher);
teacherRoutes.post("/register", registerTeacher);
teacherRoutes.post("/addBounty", addBounty);
teacherRoutes.post("/removeBounty", removeBounty);
teacherRoutes.post("/markBountyAsCompleted", markBountyAsCompleted);
teacherRoutes.post("/pauseSubmissions", pauseSubmissions);
export default teacherRoutes;
