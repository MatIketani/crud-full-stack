import { Request, Response } from "express";

export abstract class Controller {
  public abstract handle(req: Request, res: Response): Promise<any>;
}
