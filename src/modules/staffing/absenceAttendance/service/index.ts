import { Request } from "express";
import RequestAttendance from "../model";
import mongoose from "mongoose";
import Helper from "../../../../utils/Helper";
import moment from "moment";

class RequestAttendanceService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }
  getAll = async () => {
    const employeeRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.usersMappingRef
    );

    const datas = await RequestAttendance.aggregate([
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
          from: "typeAbsence",
          localField: "typeAbsenceRef",
          foreignField: "_id",
          as: "typeAbsence",
        },
      },
      {
        $unwind: "$typeAbsence",
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

          requestDate: 1,
          information: 1,
          isAgree: 1,
          requestTime: 1,
          agreeTime: 1,
          picture: 1,

          "typeAbsence.name": 1,

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
          requestDate: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$requestDate",
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

  store = async () => {
    const { requestDate, picture, typeAbsenceRef } = this.body;

    const getPicture = await Helper.uploadFile(
      "RequestAttendance",
      picture,
      "staffing/requestattendance",
      null
    );

    const setData = await RequestAttendance.create({
      clientRef: this.user.employee.clientRef,
      typeAbsenceRef: typeAbsenceRef,
      employeeRef: this.user.employee._id,
      requestDate: Helper.convertDate(requestDate),

      requestTime: moment().valueOf(),
      picture: getPicture,
      usersCreate: this.user.usersRef,
      usersUpdate: this.user.usersRef,
    });

    return {
      status: true,
      message: "Berhasil insert data",
      result: setData,
    };
  };
}

export default RequestAttendanceService;
