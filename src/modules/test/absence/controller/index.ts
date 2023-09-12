import { Request, Response } from "express";
import IController from "../interface/index";
import ExecuteAbsenceService from "../service";

class ExecuteAbsenceController implements IController {
  index = async (req: Request, res: Response) => {
    try {
      const services: ExecuteAbsenceService = new ExecuteAbsenceService(req);
      const data = await services.executeAbsence();

      return res.status(200).json({ message: data.message });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan", result: error.message });
    }
  };
}

export default new ExecuteAbsenceController();
