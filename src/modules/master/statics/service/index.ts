import { Request } from "express";
import Statics from "../model";

class StaticsService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }

  getAll = async () => {
    const datas = await Statics.find({
      clientRef: this.user.usersMappingRef,
      isActive: true,
    });
    return datas;
  };

  store = async () => {
    const { name, staticType, isActive } = this.body;
    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;

    const data = await Statics.create({
      clientRef: this.user.usersMappingRef,
      name,
      staticType,
      isActive: setIsActive,
    });

    return data;
  };

  getOne = async () => {
    const { id } = this.params;
    const data = await Statics.findOne({
      _id: id,
    });

    return data;
  };

  update = async () => {
    const { id } = this.params;
    const { name, staticType, isActive } = this.body;
    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;
    const data = await Statics.updateOne(
      { _id: id },
      { clientRef: this.user.usersMappingRef, name, staticType, isActive: setIsActive }
    );
    return data;
  };

  delete = async () => {
    const { id } = this.params;

    const data = await Statics.deleteOne({ _id: id });
    return data;
  };
}

export default StaticsService;
