import {
  CreateUser,
  LoginToUser,
  DeleteUser,
  GetUserInfo,
} from "../controllers/User/UserController";
import { Auth } from "../middlewares/Auth/Auth";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();
const CreateUserVar = new CreateUser();
const LoginToUserVar = new LoginToUser();
const DeleteUserVar = new DeleteUser();
const GetUserInfoVar = new GetUserInfo();
const AuthVar = new Auth();

router.route("/user").post((req: Request, res: Response) => {
  return CreateUserVar.handle(req, res);
});

router.route("/login").post((req: any, res: Response) => {
  return LoginToUserVar.handle(req, res);
});

router.route("/user").get(
  (req: any, res: Response, next: NextFunction) => {
    return AuthVar.handle(req, res, next);
  },
  (req: any, res: Response) => {
    return GetUserInfoVar.handle(req, res);
  },
);

router.route("/user").delete(
  (req: any, res: Response, next: NextFunction) => {
    return AuthVar.handle(req, res, next);
  },
  (req: any, res: Response) => {
    return DeleteUserVar.handle(req, res);
  },
);

export default router;
