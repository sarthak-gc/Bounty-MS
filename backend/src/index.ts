import "./db/db";
import routers from "./routes";
import express, { Request, Response } from "express";
const app = express();

app.use(express.json());
app.use("/", routers);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
