import cors from "cors";
import express, { Express, Router } from 'express';
import { Routes } from "./modules/shared/interface/routes.interface";
import errorHandler from "./modules/shared/middlewares/errorHandler";
import morgan from 'morgan';

class App {
  public app: Express;

  constructor(router: Router) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes(router);
    this.initializeErrorHandling();
  }

  public get self() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("tiny"))

  }

  private initializeRoutes(router: Router) {
    this.app.use('/api', router);
  }
  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }
  public listen() {
    this.app.listen(5000, () => {
      console.log("server is running");
    });
  }
}

export default App;
