import * as dotenv from "dotenv";
import path from "path";
import { App } from "./app";
import express from "express";
import { database } from "./database";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({
  path: path.resolve(__dirname, "./.env"),
});

const APP_PORT = process.env.APP_PORT as string;

let applicationObject = new App(parseInt(APP_PORT));
const app = applicationObject.getApp();

/*

Utiliza os routers e middlewares da aplicação.

*/

app.use(express.json());
app.use(cookieParser());
app.use(cors());

import UserRouter from "./routes/UserRoutes";
app.use(UserRouter);

import TaskRouter from "./routes/TaskRoutes";
app.use(TaskRouter);

applicationObject.run();

database.run();
