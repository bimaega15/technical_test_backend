import { Request, Response } from "express";

interface IController {
  index(req: Request, res: Response): any;
  create(req: Request, res: Response): Response | Promise<Response>;
}

export default IController;
