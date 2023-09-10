import { Request } from "express";
import TypeLeave from "../model";

class TypeLeaveService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }

  getAll = async () => {
    const datas = await TypeLeave.find({
      clientRef: this.user.usersRef,
      isActive: true,
    });
    return datas;
  };

  store = async () => {
    const { name, quantity, isActive } = this.body;

    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;
    const data = await TypeLeave.create({
      clientRef: this.user.usersRef,
      name,
      quantity,
      isActive: setIsActive,
      usersCreate: this.user.usersRef,
      usersUpdate: this.user.usersRef,
    });

    return data;
  };

  getOne = async () => {
    const { id } = this.params;
    const data = await TypeLeave.findOne({
      _id: id,
    });

    return data;
  };

  update = async () => {
    const { id } = this.params;
    const { name, quantity, isActive } = this.body;

    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;
    const data = await TypeLeave.updateOne(
      { _id: id },
      {
        clientRef: this.user.usersRef,
        name,
        quantity,
        isActive: setIsActive,
        usersUpdate: this.user.usersRef,
      }
    );
    return data;
  };

  delete = async () => {
    const { id } = this.params;

    const data = await TypeLeave.deleteOne({ _id: id });
    return data;
  };
}

export default TypeLeaveService;
