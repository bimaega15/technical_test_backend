import { Request, Response } from "express";
import IController from "../interface/index";
import AuthService from "../service";

class AuthController implements IController {
  index = async (req: Request, res: Response) => {
    try {
      const services: AuthService = new AuthService(req);
      const datas: any = await services.authentication();
      if(datas.status == false){
        return res.status(422).json({message: datas.message});
      }

      return res
        .status(200)
        .json({ message: "Berhasil ambil data", result: datas?.result });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan", result: error.message });
    }
  };
}

export default new AuthController();
