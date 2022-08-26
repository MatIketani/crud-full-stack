import { NextFunction, Request, Response } from "express";

export interface IRequest extends Request {
  user: any;
}

export abstract class Middleware {
  public abstract handle(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any>;
}
