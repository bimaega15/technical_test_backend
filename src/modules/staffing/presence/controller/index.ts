import { Request, Response } from "express";
import IController from "../interface/index";
import PresenceService from "../service";

class PresenceController implements IController {
  index = async (req: Request, res: Response) => {
    try {
      const services: PresenceService = new PresenceService(req);
      const datas = await services.getSchedule();

      return res
        .status(200)
        .json({ message: "Berhasil ambil data", result: datas });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan", result: error.message });
    }
  };

  checkIn = async (req: Request, res: Response) => {
    try {
      const services: PresenceService = new PresenceService(req);
      const data: any = await services.postCheckIn();

      if (data.status == false) {
        return res.status(422).json({
          message: data.message,
        });
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
  
  checkOut = async (req: Request, res: Response) => {
    try {
      const services: PresenceService = new PresenceService(req);
      const data: any = await services.postCheckOut();

      if (data.status == false) {
        return res.status(422).json({
          message: data.message,
        });
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

export default new PresenceController();
