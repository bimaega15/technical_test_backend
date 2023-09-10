import { Request } from "express";
import Officer from "../model";

class OfficerService {
  body: Request["body"];
  params: Request["params"];

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
  }

  getAll = async () => {
    const datas = await Officer.find();
    return datas;
  };

  store = async () => {
    const { name } = this.body;
    const data = await Officer.create({
      name,
    });

    return data;
  };

  getOne = async () => {
    const { id } = this.params;
    const data = await Officer.findOne({
      _id: id,
    });

    return data;
  };

  update = async () => {
    const { id } = this.params;
    const { name } = this.body;

    const data = await Officer.updateOne({ _id: id }, { name });
    return data;
  };

  delete = async () => {
    const { id } = this.params;

    const data = await Officer.deleteOne({ _id: id });
    return data;
  };
}

export default OfficerService;
