import { NextFunction, Request, Response } from 'express';

class SyncController {
  public sync = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default SyncController;
