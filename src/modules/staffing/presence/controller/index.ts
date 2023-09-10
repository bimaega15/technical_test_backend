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
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const services: PresenceService = new PresenceService(req);
      const data = await services.store();

      return res
        .status(200)
        .json({ message: "Berhasil insert data", result: data });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan", result: error.message });
    }
  };
  show = async (req: Request, res: Response): Promise<Response> => {
    try {
      const services: PresenceService = new PresenceService(req);
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
      const services: PresenceService = new PresenceService(req);
      await services.update();

      return res
        .status(200)
        .json({ message: "Berhasil update data", result: req.body });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan", result: error.message });
    }
  };
  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const services: PresenceService = new PresenceService(req);
      await services.delete();

      return res.status(200).json({ message: "Berhasil hapus data" });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan", result: error.message });
    }
  };
}

export default new PresenceController();