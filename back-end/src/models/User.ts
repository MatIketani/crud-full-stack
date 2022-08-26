import { Model, NonAttribute, Optional } from "sequelize";

type UserAttributes = {
  id: number;
  username: string;
  password: string;
};

type UserCreationAttributes = Optional<UserAttributes, "id">;

export class User extends Model<UserCreationAttributes> {
  declare id: number;
  declare username: string;
  declare password: string;

  get getId(): NonAttribute<number> {
    return this.id;
  }

  get getUsername(): NonAttribute<string> {
    return this.username;
  }

  get getPassword(): NonAttribute<string> {
    return this.password;
  }
}
