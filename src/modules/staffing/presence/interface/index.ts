import { Request, Response } from "express";

interface IController {
  index(req: Request, res: Response): Response | Promise<Response>;
  history(req: Request, res: Response): Response | Promise<Response>;
  checkIn(req: Request, res: Response): Response | Promise<Response>;
  checkOut(req: Request, res: Response): Response | Promise<Response>;
}

export default IController;
