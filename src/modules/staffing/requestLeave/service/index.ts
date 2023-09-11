import { Request } from "express";
import RequestLeave from "../model";
import mongoose from "mongoose";
import Helper from "../../../../utils/Helper";
import TypeLeave from "../../../master/typeLeave/model/index";
import moment from "moment";
import LeaveBallance from "../../../transaction/leaveBallance/model/index";

class RequestLeaveService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }

  getLeaveBallance = async () => {
    const employeeRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
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
          employeeRef: employeeRef,
          isActive: true,
        },
      },
      {
        $project: {
          _id: 1,
          earlyPeriod: 1,
          endPeriod: 1,
          ballance: 1,
          isActive: 1,

          "typeLeave._id": 1,
          "typeLeave.name": 1,

          "employee._id": 1,
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
    const { leaveBallanceRef, startDateLeave, endDateLeave, picture } =
      this.body;

    const getLeaveBallanceRef: mongoose.Types.ObjectId =
      new mongoose.Types.ObjectId(leaveBallanceRef);

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
          _id: getLeaveBallanceRef,
          isActive: true,
        },
      },
      {
        $project: {
          _id: 1,
          earlyPeriod: 1,
          endPeriod: 1,
          ballance: 1,
          isActive: 1,
          clientRef: 1,

          "typeLeave._id": 1,
          "typeLeave.name": 1,

          "employee._id": 1,
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
    const getData = data[0];

    const getPicture = await Helper.uploadFile(
      "RequestLeave",
      picture,
      "staffing/requestLeave",
      null
    );

    const setData = await RequestLeave.create({
      clientRef: getData.clientRef,
      typeLeaveRef: getData.typeLeave._id,
      employeeRef: getData.employee._id,
      startDateLeave: Helper.convertDate(startDateLeave),
      endDateLeave: Helper.convertDate(endDateLeave),

      requestTime: moment().valueOf(),
      picture: getPicture,
      usersCreate: this.user.usersRef,
      usersUpdate: this.user.usersRef,
    });

    return setData;
  };

  getHistory = async () => {
    const employeeRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.usersMappingRef
    );

    const datas = await RequestLeave.aggregate([
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
          localField: "employeeChangeRef",
          foreignField: "_id",
          as: "employeeChangeRef",
        },
      },
      {
        $unwind: {
          path: "$employeeChangeRef",
          preserveNullAndEmptyArrays: true,
        },
      },
  
      {
        $lookup: {
          from: "employee",
          localField: "superiorRef",
          foreignField: "_id",
          as: "superiorRef",
        },
      },
      {
        $unwind: {
          path: "$superiorRef",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $match: {
          employeeRef: employeeRef,
        },
      },
      {
        $project: {
          _id: 1,
          clientRef: 1,

          startDateLeave: 1,
          endDateLeave: 1,
          information: 1,
          isAgree: 1,
          requestTime: 1,
          agreeTime: 1,
          picture: 1,

          "typeLeave.name": 1,
          "typeLeave.quantity": 1,

          "employee.name": 1,
          "employee.fullName": 1,
          "employee.gender": 1,
          "employee.phoneNumber1": 1,
          "employee.employeeNumber": 1,
          "employee.numberIdentity": 1,
          "employee.ktpAddress": 1,

          "employeeChangeRef.name": 1,
          "employeeChangeRef.fullName": 1,
          "employeeChangeRef.gender": 1,
          "employeeChangeRef.phoneNumber1": 1,
          "employeeChangeRef.employeeNumber": 1,
          "employeeChangeRef.numberIdentity": 1,
          "employeeChangeRef.ktpAddress": 1,

          "superiorRef.name": 1,
          "superiorRef.fullName": 1,
          "superiorRef.gender": 1,
          "superiorRef.phoneNumber1": 1,
          "superiorRef.employeeNumber": 1,
          "superiorRef.numberIdentity": 1,
          "superiorRef.ktpAddress": 1,
        },
      },
      {
        $addFields: {
          startDateLeave: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$startDateLeave",
              },
              timezone: "Asia/Jakarta",
            },
          },
          endDateLeave: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$endDateLeave",
              },
              timezone: "Asia/Jakarta",
            },
          },
          requestTime: {
            $dateToString: {
              format: "%d/%m/%Y %H:%M",
              date: {
                $toDate: "$requestTime",
              },
              timezone: "Asia/Jakarta",
            },
          },
          agreeTime: {
            $dateToString: {
              format: "%d/%m/%Y %H:%M",
              date: {
                $toDate: "$agreeTime",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
    ]);

    return datas;
  };
}

export default RequestLeaveService;
