import { Request } from "express";
import LeaveBallance from "../model";
import mongoose from "mongoose";
import Helper from "../../../../utils/Helper";
import TypeLeave from "../../../master/typeLeave/model/index";

class LeaveBallanceService {
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
      this.user.usersMappingRef
    );
    const datas = await LeaveBallance.aggregate([
      {
        $lookup: {
          from: "typeLeave",
          localField: "typeLeaveRef",
          foreignField: "_id",
          as: "typeLeave",
        },
      },
      {
        $unwind: "$typeLeave",
      },
      {
        $lookup: {
          from: "employee",
          localField: "employeeRef",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },

      {
        $match: {
          clientRef: clientRef,
          isActive: true,
        },
      },
      {
        $project: {
          _id: 1,
          clientRef: 1,
          earlyPeriod: 1,
          endPeriod: 1,
          ballance: 1,
          isActive: 1,

          "typeLeave.name": 1,

          "employee.name": 1,
          "employee.fullName": 1,
          "employee.gender": 1,
          "employee.phoneNumber1": 1,
          "employee.employeeNumber": 1,
          "employee.numberIdentity": 1,
          "employee.ktpAddress": 1,
        },
      },
      {
        $addFields: {
          earlyPeriod: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$earlyPeriod",
              },
              timezone: "Asia/Jakarta",
            },
          },
          endPeriod: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$endPeriod",
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
    const { typeLeaveRef, employeeRef, earlyPeriod, endPeriod, isActive } =
      this.body;

    const getTypeLeave: any = await TypeLeave.findOne({
      _id: typeLeaveRef,
    });

    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;

    const data = await LeaveBallance.create({
      clientRef: this.user.usersMappingRef,
      typeLeaveRef,
      employeeRef,
      earlyPeriod: Helper.convertDate(earlyPeriod),
      endPeriod: Helper.convertDate(endPeriod),
      ballance: getTypeLeave.quantity,
      isActive: setIsActive,
      usersCreate: this.user.usersRef,
      usersUpdate: this.user.usersRef,
    });

    return data;
  };

  getOne = async () => {
    const { id } = this.params;
    const refId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

    const data = await LeaveBallance.aggregate([
      {
        $lookup: {
          from: "typeLeave",
          localField: "typeLeaveRef",
          foreignField: "_id",
          as: "typeLeave",
        },
      },
      {
        $unwind: "$typeLeave",
      },
      {
        $lookup: {
          from: "employee",
          localField: "employeeRef",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },

      {
        $match: {
          _id: refId,
        },
      },
      {
        $project: {
          _id: 1,
          clientRef: 1,
          earlyPeriod: 1,
          endPeriod: 1,
          ballance: 1,
          isActive: 1,

          "typeLeave.name": 1,

          "employee.name": 1,
          "employee.fullName": 1,
          "employee.gender": 1,
          "employee.phoneNumber1": 1,
          "employee.employeeNumber": 1,
          "employee.numberIdentity": 1,
          "employee.ktpAddress": 1,
        },
      },
      {
        $addFields: {
          earlyPeriod: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$earlyPeriod",
              },
              timezone: "Asia/Jakarta",
            },
          },
          endPeriod: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$endPeriod",
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
    const { typeLeaveRef, employeeRef, earlyPeriod, endPeriod, isActive } =
      this.body;

    const getTypeLeave: any = await TypeLeave.findOne({
      _id: typeLeaveRef,
    });

    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;
    const data = await LeaveBallance.updateOne(
      { _id: id },
      {
        clientRef: this.user.usersMappingRef,
        typeLeaveRef,
        employeeRef,
        earlyPeriod: Helper.convertDate(earlyPeriod),
        endPeriod: Helper.convertDate(endPeriod),
        ballance:  getTypeLeave.quantity,
        isActive: setIsActive,
        usersUpdate: this.user.usersRef,
      }
    );
    return data;
  };

  delete = async () => {
    const { id } = this.params;

    const data = await LeaveBallance.deleteOne({ _id: id });
    return data;
  };
}

export default LeaveBallanceService;
