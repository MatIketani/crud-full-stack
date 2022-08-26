import { Sequelize } from "sequelize";

interface connectionInterface {
  databaseHost: string;
  databaseUser: string;
  databasePass: string;
  databasePort: number;
  databaseName: string;
}

export class Database {
  private databaseConnection: Sequelize;

  constructor(connInfo: connectionInterface) {
    const {
      databaseHost,
      databaseUser,
      databasePass,
      databasePort,
      databaseName,
    } = connInfo;

    this.databaseConnection = new Sequelize(
      databaseName,
      databaseUser,
      databasePass,
      {
        host: databaseHost,
        dialect: "mysql",
        port: databasePort,
      },
    );
  }

  public getConnection(): Sequelize {
    return this.databaseConnection;
  }

  public async run(): Promise<void> {
    this.databaseConnection
      .sync()
      .then(() => {
        console.log("[DATABASE] Database iniciada com sucesso!");
      })
      .catch((error: Error) => {
        console.log(
          `[DEBUG] Ocorreu um erro em ${__filename}\nErro: ${error.message}`,
        );
      });
  }
}
