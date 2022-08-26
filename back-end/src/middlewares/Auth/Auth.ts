import { NextFunction, Response } from "express";
import { IRequest, Middleware } from "../Middleware";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export class Auth implements Middleware {
  public async handle(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "ACCESS_DENIED" });
    }

    try {
      req.user = jwt.verify(token, JWT_SECRET_KEY);
      next();
    } catch (error) {
      res.status(401).json({ message: "ACCESS_DENIED" });
      console.log(error);
    }
  }
}
