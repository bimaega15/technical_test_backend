import { Request, Response } from "express";

interface IController {
  index(req: Request, res: Response): any;
  create(req: Request, res: Response): Response | Promise<Response>;
  history(req: Request, res: Response): Response | Promise<Response>;
  update(req: Request, res: Response): Response | Promise<Response>;
  delete(req: Request, res: Response): Response | Promise<Response>;
}

export default IController;
