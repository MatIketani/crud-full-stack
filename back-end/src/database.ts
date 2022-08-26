import { Database } from "./models/Database";
import * as dotenv from "dotenv";
import path from "path";

import { User } from "./models/User";
import { DataTypes } from "sequelize";
import { Task } from "./models/Task";

dotenv.config({
  path: path.resolve(__dirname, "./.env"),
});

const DATABASE_HOST = process.env.DATABASE_HOST as string;
const DATABASE_USER = process.env.DATABASE_USER as string;
const DATABASE_PASS = process.env.DATABASE_PASS as string;
const DATABASE_PORT = process.env.DATABASE_PORT as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

export const database = new Database({
  databaseHost: DATABASE_HOST,
  databaseUser: DATABASE_USER,
  databasePass: DATABASE_PASS,
  databasePort: parseInt(DATABASE_PORT),
  databaseName: DATABASE_NAME,
});

/*

Inicialização dos modelos do banco de dados

*/

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(127),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    sequelize: database.getConnection(),
  },
);

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(158),
      allowNull: true,
    },
    deadlineTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tasks",
    sequelize: database.getConnection(),
  },
);

/*

Relationships banco de dados

*/

User.hasMany(Task, {
  foreignKey: "ownerId",
});
Task.belongsTo(User, {
  foreignKey: "ownerId",
});
