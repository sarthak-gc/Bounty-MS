import mongoose from "mongoose";
import "./db/db";
import { teacherModel } from "./models/teacher.model";
import routers from "./routes";
import express, { Request, Response } from "express";
const app = express();
import cors from "cors";
app.use(express.json());
app.use(cors());
app.use("/", routers);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
