import { Request, Response } from "express";

interface IController {
  index(req: Request, res: Response): any;

}

export default IController;
