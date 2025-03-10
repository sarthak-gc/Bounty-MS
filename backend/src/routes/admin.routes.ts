import express from "express";
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
  getTeacherBounty,
  getTeacherBalance,
  getUserSubmissions,
} from "../controllers/admin.controllers";
const adminRoutes = express.Router();

adminRoutes.post("/login", adminLogin);
adminRoutes.get("/registrations", getAllRegistrations);

adminRoutes.post("/registrations/verify/:registrationId", verifyRegistrations);
adminRoutes.post("/registrations/reject/:registrationId", rejectRegistrations);
adminRoutes.get("/bounties", allBounties);

adminRoutes.post("/balance/teacher/:teacherId", addTeacherBalance);
adminRoutes.get("/balance/:teacherId", getTeacherBalance);

adminRoutes.delete("/users/:role/:userId", deleteUsers);
adminRoutes.delete("/bounties/:bountyId", removeBounty);
adminRoutes.put("/submissions/pause/:bountyId", pauseSubmissions);
adminRoutes.get("/user/:role/:userId", getUser);
adminRoutes.get("/submissions/:userId", getUserSubmissions);
adminRoutes.get("/users", getAllUsers);
adminRoutes.get("/bounties/:bountyId", viewIndividualBounty);
adminRoutes.put("/updatePassword/:userId", updatePassword);
adminRoutes.post("/sendNotifications", sendNotifications);

adminRoutes.get("/bounties/teacher/:teacherId", getTeacherBounty);
export default adminRoutes;
