import { Request } from "express";
import Absence from "../model";

class AbsenceService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }

  getAll = async () => {
    const datas = await Absence.find({
      clientRef: this.user.usersRef,
      isActive: true,
    });
    return datas;
  };

  store = async () => {
    const { employeeRef, scheduleRef, dateSchedule } = this.body;

    const data = await Absence.create({
      clientRef: this.user.usersRef,
      employeeRef,
      scheduleRef,
      dateSchedule,
    });

    return data;
  };

  getOne = async () => {
    const { id } = this.params;
    const data = await Absence.findOne({
      _id: id,
    });

    return data;
  };

  update = async () => {
    const { id } = this.params;
    const { employeeRef, scheduleRef, dateSchedule } = this.body;

    const data = await Absence.updateOne(
      { _id: id },
      { clientRef: this.user.usersRef, employeeRef, scheduleRef, dateSchedule }
    );
    return data;
  };

  delete = async () => {
    const { id } = this.params;

    const data = await Absence.deleteOne({ _id: id });
    return data;
  };
}

export default AbsenceService;
