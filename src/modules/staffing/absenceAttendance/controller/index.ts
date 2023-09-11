import { Request, Response } from "express";
import IController from "../interface/index";

import RequestAttendanceService from "../service";

class RequestAttendanceController implements IController {
  index = async (req: Request, res: Response) => {
    try {
      const services: RequestAttendanceService = new RequestAttendanceService(
        req
      );
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
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const services: RequestAttendanceService = new RequestAttendanceService(
        req
      );
      const data = await services.store();
      if (data.status == false) {
        return res.status(422).json({ message: data.message });
      }

      return res
        .status(200)
        .json({ message: data.message, result: data.result });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan", result: error.message });
    }
  };
}

export default new RequestAttendanceController();
