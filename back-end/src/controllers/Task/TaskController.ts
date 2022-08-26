import { Response } from "express";
import { IRequest } from "../../middlewares/Middleware";
import { Controller } from "../Controller";
import { Task } from "../../models/Task";
import { User } from "../../models/User";

export class CreateTask implements Controller {
  public async handle(req: IRequest, res: Response) {
    try {
      const { title, description, deadlineTime } = req.body;
      const { account_id } = req.user;

      if (!title) {
        return res.status(400).json({ message: "MISSING_DATA" });
      }

      const task = await Task.create({
        title: title,
        description: description,
        deadlineTime: deadlineTime,
        ownerId: account_id,
      });
      res.status(200).json({ message: "TASK_CREATED", id: task.getId });
    } catch (error) {
      res.status(500).json({ message: "INTERNAL_ERROR" });
      console.log(error);
    }
  }
}

export class GetAllTasks implements Controller {
  public async handle(req: IRequest, res: Response) {
    try {
      return res
        .status(200)
        .json(await Task.findAll({ where: { ownerId: req.user.account_id } }));
    } catch (error) {
      res.status(500).json({ message: "INTERNAL_ERROR" });
      console.log(error);
    }
  }
}

export class GetTask implements Controller {
  public async handle(req: IRequest, res: Response) {
    try {
      const { id } = req.params;

      const task = await Task.findOne({
        where: { id: id, ownerId: req.user.account_id },
      });

      if (!task) {
        return res.status(400).json({ message: "NOT_FOUND" });
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: "INTERNAL_ERROR" });
      console.log(error);
    }
  }
}

export class UpdateTask implements Controller {
  public async handle(req: IRequest, res: Response) {
    try {
      const { title, description, deadlineTime } = req.body;
      const { account_id } = req.user;
      const { id } = req.params;

      const userInfo = User.findByPk(account_id);

      if (!userInfo) {
        return res.status(404).json({ message: "USER_DOESNT_EXISTS" });
      }

      const task = Task.findOne({ where: { id: id, ownerId: account_id } });

      if (!task) {
        return res.status(404).json({ message: "TASK_NOT_FOUND" });
      }

      await Task.update(
        { title: title, description: description, deadlineTime: deadlineTime },
        { where: { id: id, ownerId: account_id } },
      );
      res.status(200).json({ message: "TASK_UPDATED" });
    } catch (error) {}
  }
}

export class DeleteTask implements Controller {
  public async handle(req: IRequest, res: Response) {
    try {
      const { id } = req.params;

      const task = await Task.findOne({
        where: { id: id, ownerId: req.user.account_id },
      });

      if (!task) {
        return res.status(404).json({ message: "NOT_FOUND" });
      }

      Task.destroy({ where: { id: task.getId } });
    } catch (error) {
      res.status(500).json({ message: "INTERNAL_ERROR" });
      console.log(error);
    }
  }
}
