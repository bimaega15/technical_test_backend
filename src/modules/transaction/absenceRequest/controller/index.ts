import { Request, Response } from "express";
import IController from "../interface/index";

import AbsenceRequestService from "../service";

class AbsenceRequestController implements IController {
  index = async (req: Request, res: Response) => {
    try {
      const services: AbsenceRequestService = new AbsenceRequestService(req);
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

  show = async (req: Request, res: Response) => {
    try {
      const services: AbsenceRequestService = new AbsenceRequestService(req);
      const data = await services.getOne();

      return res
        .status(200)
        .json({ message: "Berhasil ambil data", result: data });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan", result: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const services: AbsenceRequestService = new AbsenceRequestService(req);
      const data = await services.update();

      return res
        .status(200)
        .json({ message: "Berhasil insert data", result: data });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan", result: error.message });
    }
  };
 }

export default new AbsenceRequestController();
