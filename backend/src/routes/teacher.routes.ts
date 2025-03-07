import express, { Request, Response } from "express";
import {
  addBounty,
  currentBounties,
  loginTeacher,
  markBountyAsCompleted,
  pauseSubmissions,
  registerTeacher,
  rejectBountyRequest,
  removeBounty,
  studentSubmissions,
  updatePassword,
  viewIndividualBounty,
  viewIndividualStudent,
  viewStudents,
} from "../controllers/teacher.controllers";
import authMiddleware from "../middlewares/authmiddleware";
const teacherRoutes = express.Router();

teacherRoutes.post("/login", loginTeacher);
teacherRoutes.post("/register", registerTeacher);

teacherRoutes.use(authMiddleware);
teacherRoutes.post("/bounty", addBounty);
teacherRoutes.delete("/bounty/:bountyId", removeBounty);

teacherRoutes.put("/bounties/accept/:bountyId", markBountyAsCompleted);
teacherRoutes.put("/bounties/pause/:bountyId", pauseSubmissions);

teacherRoutes.get("/students", viewStudents);
teacherRoutes.get("/bounties", currentBounties);
teacherRoutes.get("/student/:studentId", viewIndividualStudent);
teacherRoutes.get("/bounties/:bountyId", viewIndividualBounty);

teacherRoutes.put("/bounties/reject/:bountyId", rejectBountyRequest);
teacherRoutes.get("/submission/:studentId", studentSubmissions);

teacherRoutes.put("/password", updatePassword);

export default teacherRoutes;
