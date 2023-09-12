import { Request, Response } from "express";
import IController from "../interface/index";

import ReportAbsenceService from "../service";

class ReportAbsenceController implements IController {
  index = async (req: Request, res: Response) => {
    try {
      const services: ReportAbsenceService = new ReportAbsenceService(req);
      const datas = await services.getAll();

      return res
        .status(200)
        .json({ message: "Berhasil ambil data", result: datas });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan", result: error.message });
    }
  };
}

export default new ReportAbsenceController();
