import { Request, Response } from "express";
import { Controller } from "../Controller";
import { User } from "../../models/User";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IRequest } from "../../middlewares/Middleware";
import { Task } from "../../models/Task";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export class CreateUser implements Controller {
  public async handle(req: Request, res: Response): Promise<any> {
    try {
      const { username } = req.body;
      let { password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "MISSING_DATA" });
      }

      const userInfo = await User.findOne({ where: { username: username } });

      if (userInfo) {
        return res.status(409).json({ message: "USER_ALREADY_EXISTS" });
      }

      if (username.length > 40) {
        return res
          .status(400)
          .json({ message: "USERNAME_LENGTH_LIMIT_EXCEEDED" });
      }

      if (password.length > 127) {
        return res
          .status(400)
          .json({ message: "PASSWORD_LENGTH_LIMIT_EXCEEDED" });
      }

      password = await bcrypt.hash(password, bcrypt.genSaltSync(10));

      User.create({
        username: username,
        password: password,
      });

      res.status(200).json({ message: "ACCOUNT_CREATED" });
    } catch (error) {
      res.status(500).json({ message: "INTERNAL_ERROR" });
      console.log(error);
    }
  }
}

export class GetUserInfo implements Controller {
  public async handle(req: IRequest, res: Response): Promise<any> {
    try {
      const { account_id } = req.user;

      const userInfo = await User.findByPk(account_id);

      if (!userInfo) {
        return res.status(200).json({ message: "USER_NOT_FOUND" });
      }

      const userTasks = await Task.findAll({
        where: {
          ownerId: account_id,
        },
      });

      res.status(200).json({
        username: userInfo.getUsername,
        tasks: userTasks,
      });
    } catch (err) {
      res.status(500).json({ message: "INTERNAL_ERROR" });
    }
  }
}

export class LoginToUser implements Controller {
  public async handle(req: Request, res: Response): Promise<any> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "MISSING_DATA" });
      }

      const userInfo = await User.findOne({ where: { username: username } });

      if (!userInfo) {
        return res.status(200).json({ message: "USER_NOT_FOUND" });
      }

      const passwordComparison = await bcrypt.compare(
        password,
        userInfo.getPassword,
      );

      if (passwordComparison) {
        return res.status(200).json({
          message: "LOGIN_SUCCESSFUL",
          jwt: jwt.sign({ account_id: userInfo.getId }, JWT_SECRET_KEY, {
            expiresIn: 14400,
          }),
        });
      }

      res.status(200).json({ message: "USER_OR_PASSWORD_INCORRECT" });
    } catch (error) {
      res.status(500).json({ message: "INTERNAL_ERROR" });
    }
  }
}

export class DeleteUser implements Controller {
  public async handle(req: IRequest, res: Response): Promise<any> {
    try {
      const user = req.user;

      const userInfo = await User.findByPk(user.account_id);
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "MISSING_DATA" });
      }

      if (!userInfo) {
        return res.status(404).json({ message: "USER_NOT_FOUND" });
      }

      const passwordComparison = await bcrypt.compare(
        password,
        userInfo.getPassword,
      );

      if (passwordComparison) {
        User.destroy({ where: { id: user.account_id } });
        return res.status(200).json({ message: "ACCOUNT_DELETED" });
      }

      res.status(401).json({ message: "INCORRECT_PASSWORD" });
    } catch (error) {
      res.status(500).json({ message: "INTERNAL_ERROR" });
    }
  }
}
