import { Router } from 'express';
import SyncController from '@controllers/sync.controller';
import { Routes } from '@interfaces/routes.interface';

class SyncRoute implements Routes {
  public path = '/sync';
  public router = Router();
  public syncController = new SyncController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.syncController.sync);
  }
}

export default SyncRoute;
