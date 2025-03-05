import express, { Request } from "express";
import {
  addTeacherBalance,
  allBounties,
  deleteUsers,
  pauseSubmissions,
  verifyRegistrations,
} from "../controllers/admin.controllers";
const adminRoutes = express.Router();

adminRoutes.get("/allBounties", allBounties);
adminRoutes.get("/addTeacherBalance", addTeacherBalance);
adminRoutes.get("/deleteUsers", deleteUsers);
adminRoutes.get("/pauseSubmissions", pauseSubmissions);
adminRoutes.get("/verifyRegistrations", verifyRegistrations);
export default adminRoutes;
