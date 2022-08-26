import { IntegerDataType, Model, NonAttribute, Optional } from "sequelize";

type TaskAttributes = {
  id: number;
  title: string;
  description?: string;
  deadlineTime?: Date;
  ownerId: number;
};

type TaskCreationAttributes = Optional<
  TaskAttributes,
  "id" | "description" | "deadlineTime"
>;

export class Task extends Model<TaskCreationAttributes> {
  declare id: number;
  declare title: string;
  declare description: string;
  declare deadlineTime: Date;
  declare ownerId: number;

  get getId(): NonAttribute<number> {
    return this.id;
  }

  get getTitle(): NonAttribute<string> {
    return this.title;
  }

  get getDescription(): NonAttribute<string> {
    return this.title;
  }

  get getDeadlineTime(): NonAttribute<Date> {
    return this.deadlineTime;
  }

  get getOwnerId(): NonAttribute<number> {
    return this.ownerId;
  }
}
