import { Request } from "express";
import RequestAttendance from "../../../staffing/absenceAttendance/model/index";
import mongoose from "mongoose";
import moment from "moment";
import Absence from "../../../transaction/absence/model/index";
import Helper from "../../../../utils/Helper";

class AbsenceAttendanceService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }

  getAll = async () => {
    const superiorRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
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
          "superiorRef._id": superiorRef,
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

          "superiorRef._id": 1,
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

  getOne = async () => {
    const { id }: any = this.params;

    const refId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

    const data = await RequestAttendance.aggregate([
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
          _id: refId,
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

          "superiorRef._id": 1,
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
    return data[0];
  };

  update = async () => {
    const { id } = this.params;
    const { isAgree } = this.body;

    const refId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

    const data = await RequestAttendance.aggregate([
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
          _id: refId,
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
          typeAbsenceRef: 1,

          "typeAbsence.name": 1,

          "employee._id": 1,
          "employee.name": 1,
          "employee.fullName": 1,
          "employee.gender": 1,
          "employee.phoneNumber1": 1,
          "employee.employeeNumber": 1,
          "employee.numberIdentity": 1,
          "employee.ktpAddress": 1,

          "employeeChangeRef._id": 1,
          "employeeChangeRef.name": 1,
          "employeeChangeRef.fullName": 1,
          "employeeChangeRef.gender": 1,
          "employeeChangeRef.phoneNumber1": 1,
          "employeeChangeRef.employeeNumber": 1,
          "employeeChangeRef.numberIdentity": 1,
          "employeeChangeRef.ktpAddress": 1,

          "superiorRef._id": 1,
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
    const getData = data[0];

    let setIsAgree =
      isAgree != undefined ? (isAgree == 1 ? true : false) : false;

    if (setIsAgree) {
      let getRequestDate = getData.requestDate;
      let employeeChangeRef = getData.employeeChangeRef._id;
      let employeeRef = getData.employee._id;
      const refEmployee: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
        employeeRef
      );


      await Absence.updateOne(
        {
          employeeRef: refEmployee,
          dateSchedule: Helper.convertDate(getRequestDate),
        },
        {
          $set: {
            isChangeSchedule: true,
            replacementEmployee: employeeChangeRef,
            typeAbsenceRef: getData.typeAbsenceRef,
            isAgree: setIsAgree,
          },
        }
      );
    }

    const dataUpdate = await RequestAttendance.updateOne(
      { _id: id },
      {
        isAgree: setIsAgree,
        agreeTime: moment().valueOf(),
        usersUpdate: this.user.usersRef,
      }
    );
    return dataUpdate;
  };
}

export default AbsenceAttendanceService;
