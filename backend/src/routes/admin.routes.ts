import express, { Request } from "express";
import {
  addTeacherBalance,
  allBounties,
  deleteUsers,
  pauseSubmissions,
  verifyRegistrations,
  removeBounty,
  getAllRegistrations,
  adminLogin,
  getUser,
  getAllUsers,
  viewIndividualBounty,
  updatePassword,
  sendNotifications,
  rejectRegistrations,
} from "../controllers/admin.controllers";
const adminRoutes = express.Router();

adminRoutes.post("/login", adminLogin);
adminRoutes.get("/registrations", getAllRegistrations);

adminRoutes.post("/registrations/verify/:registrationId", verifyRegistrations);
adminRoutes.post("/registrations/reject/:registrationId", rejectRegistrations);
adminRoutes.get("/bounties", allBounties);

adminRoutes.post("/teacher-balance/:teacherId", addTeacherBalance);
adminRoutes.delete("/users/:userId", deleteUsers);
adminRoutes.delete("/bounties/:bountyId", removeBounty);
adminRoutes.put("/submissions/pause/:bountyId", pauseSubmissions);
adminRoutes.get("/user/:userId", getUser);
adminRoutes.get("/users", getAllUsers);
adminRoutes.get("/bounties/:bountyId", viewIndividualBounty);
adminRoutes.put("/updatePassword/:userId", updatePassword);
adminRoutes.post("/sendNotifications", sendNotifications);

export default adminRoutes;
