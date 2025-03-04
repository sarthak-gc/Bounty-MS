import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const routers = express.Router();

routers.get("/teacher", (req: Request, res: Response) => {});
routers.get("/admin", (req: Request, res: Response) => {});
routers.get("/student", (req: Request, res: Response) => {});
console.log("here");

export default routers;
