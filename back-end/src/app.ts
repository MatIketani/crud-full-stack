import express, { Express } from "express";

export class App {
  private port: number;
  private app: Express;

  constructor(port: number) {
    this.port = port;
    this.app = express();
  }

  public run(): void {
    this.app.listen(this.port, () => {
      console.log("[SERVER] Server running on port", this.port);
    });
  }

  public getApp(): Express {
    return this.app;
  }
}
