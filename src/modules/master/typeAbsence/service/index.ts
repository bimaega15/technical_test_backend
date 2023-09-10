import { Request } from "express";
import TypeAbsence from "../model";

class TypeAbsenceService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }

  getAll = async () => {
    const datas = await TypeAbsence.find({
      clientRef: this.user.usersRef,
      isActive: true,
    });
    return datas;
  };

  store = async () => {
    const { name, isActive } = this.body;
    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;
    const data = await TypeAbsence.create({
      clientRef: this.user.usersRef,
      name,
      isActive: setIsActive,
      usersCreate: this.user.usersRef,
      usersUpdate: this.user.usersRef,
    });

    return data;
  };

  getOne = async () => {
    const { id } = this.params;
    const data = await TypeAbsence.findOne({
      _id: id,
    });

    return data;
  };

  update = async () => {
    const { id } = this.params;
    const { name, isActive } = this.body;
    
    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;
    const data = await TypeAbsence.updateOne(
      { _id: id },
      {
        clientRef: this.user.usersRef,
        name,
        isActive: setIsActive,
        usersUpdate: this.user.usersRef,
      }
    );
    return data;
  };

  delete = async () => {
    const { id } = this.params;

    const data = await TypeAbsence.deleteOne({ _id: id });
    return data;
  };
}

export default TypeAbsenceService;
