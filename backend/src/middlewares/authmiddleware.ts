import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { teacherModel } from "../models/teacher.model";
import { studentModel } from "../models/student.model";
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = { id: decoded.id, role: decoded.role };
    if (decoded.role === "teacher") {
      const user = teacherModel.findById(decoded.id);
      if (!user) {
        res.status(401).json({ status: "error", message: "User not found" });
        return;
      }
    } else if (decoded.role == "student") {
      const user = studentModel.findById(decoded.id);
      if (!user) {
        res.status(401).json({ status: "error", message: "User not found" });
        return;
      }
    }
    next();
  } catch (e) {
    res.status(401).json({
      status: "error",
      message: "Invalid token",
      descriptive: { error: e },
    });
    return;
  }
};

export default authMiddleware;
