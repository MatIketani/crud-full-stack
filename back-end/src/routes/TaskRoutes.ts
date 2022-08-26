import {
  CreateTask,
  GetAllTasks,
  GetTask,
  UpdateTask,
  DeleteTask,
} from "../controllers/Task/TaskController";
import { Auth } from "../middlewares/Auth/Auth";
import { Router, Response, NextFunction } from "express";
import { IRequest } from "../middlewares/Middleware";

const router = Router();
const CreateTaskVar = new CreateTask();
const GetAllTasksVar = new GetAllTasks();
const GetTaskVar = new GetTask();
const UpdateTaskVar = new UpdateTask();
const DeleteTaskVar = new DeleteTask();
const AuthVar = new Auth();

router.route("/task").post(
  (req: any, res: Response, next: NextFunction) => {
    return AuthVar.handle(req, res, next);
  },
  (req: any, res: Response) => {
    return CreateTaskVar.handle(req, res);
  },
);

router.route("/task").get(
  (req: any, res: Response, next: NextFunction) => {
    return AuthVar.handle(req, res, next);
  },
  (req: any, res: Response) => {
    return GetAllTasksVar.handle(req, res);
  },
);

router.route("/task/:id").get(
  (req: any, res: Response, next: NextFunction) => {
    return AuthVar.handle(req, res, next);
  },
  (req: any, res: Response) => {
    return GetTaskVar.handle(req, res);
  },
);

router.route("/task/:id").patch(
  (req: any, res: Response, next: NextFunction) => {
    return AuthVar.handle(req, res, next);
  },
  (req: any, res: Response) => {
    return UpdateTaskVar.handle(req, res);
  },
);

router.route("/task/:id").get(
  (req: any, res: Response, next: NextFunction) => {
    return AuthVar.handle(req, res, next);
  },
  (req: any, res: Response) => {
    return DeleteTaskVar.handle(req, res);
  },
);

export default router;
