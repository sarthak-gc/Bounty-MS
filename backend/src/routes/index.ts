import express from "express";
import dotenv from "dotenv";
import teacherRoutes from "./teacher.routes";
import studentRoutes from "./students.routes";
import adminRoutes from "./admin.routes";
dotenv.config();

const routers = express.Router();

routers.use("/teacher", teacherRoutes);
routers.use("/admin", adminRoutes);
routers.use("/student", studentRoutes);

export default routers;
