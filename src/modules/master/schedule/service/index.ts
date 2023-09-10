import { Request } from "express";
import Schedule from "../model";
import moment from "moment";
import mongoose from "mongoose";

class ScheduleService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }

  getAll = async () => {
    const clientRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.usersRef
    );
    const datas = await Schedule.aggregate([
      {
        $match: {
          clientRef: clientRef,
          isActive: true,
        },
      },
      {
        $addFields: {
          timeEntry: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$timeEntry",
              },
              timezone: "Asia/Jakarta",
            },
          },
          timeOut: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$timeOut",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
    ]);
    return datas;
  };

  store = async () => {
    const { timeEntry, timeOut, isActive, color, typeSchedule } = this.body;

    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;

    const data = await Schedule.create({
      clientRef: this.user.usersRef,
      timeEntry: moment(timeEntry, "HH:mm").valueOf(),
      timeOut: moment(timeOut, "HH:mm").valueOf(),
      isActive: setIsActive,
      color,
      typeSchedule,
    });

    return data;
  };

  getOne = async () => {
    const { id } = this.params;
    const clientRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.usersRef
    );
    const data = await Schedule.aggregate([
      {
        $match: {
          clientRef: clientRef,
          isActive: true,
        },
      },
      {
        $addFields: {
          timeEntry: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$timeEntry",
              },
              timezone: "Asia/Jakarta",
            },
          },
          timeOut: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$timeOut",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $limit: 1,
      },
    ]);

    return data[0];
  };

  update = async () => {
    const { id } = this.params;
    const { timeEntry, timeOut, isActive, color, typeSchedule } = this.body;

    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;
    const data = await Schedule.updateOne(
      { _id: id },
      {
        clientRef: this.user.usersRef,
        timeEntry: moment(timeEntry, "HH:mm").valueOf(),
        timeOut: moment(timeOut, "HH:mm").valueOf(),
        isActive: setIsActive,
        color,
        typeSchedule,
      }
    );
    return data;
  };

  delete = async () => {
    const { id } = this.params;

    const data = await Schedule.deleteOne({ _id: id });
    return data;
  };
}

export default ScheduleService;