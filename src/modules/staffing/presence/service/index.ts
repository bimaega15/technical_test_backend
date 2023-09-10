import { Request } from "express";
import Absence from "../../../transaction/absence/model/index";
import moment from "moment";
import Schedule from "../../../master/schedule/model/index";
import Helper from "../../../../utils/Helper";
import mongoose from "mongoose";

class PresenceService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }

  getSchedule = async () => {
    const employeeRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.employee._id
    );

    const data = await Absence.aggregate([
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
          from: "schedule",
          localField: "scheduleRef",
          foreignField: "_id",
          as: "schedule",
        },
      },
      {
        $unwind: "$schedule",
      },
      {
        $project: {
          employeeRef: 1,
          dateSchedule: 1,
          isWork: 1,
          isPresent: 1,
          entryTime: 1,
          outTime: 1,
          isTooLate: 1,
          isEarlyHome: 1,
          isLeave: 1,
          isOvertime: 1,
          totalHoursWorked: 1,
          totalHoursReal: 1,
          totalHoursLate: 1,
          totalHoursEaryly: 1,
          totalHoursOvertime: 1,
          reasonLate: 1,
          reasonEarly: 1,
          isChangeSchedule: 1,
          isHomeCare: 1,
          isAgree: 1,
          superiorsStatement: 1,
          employeeStatement: 1,

          "employee.name": 1,
          "employee.fullName": 1,
          "employee.gender": 1,
          "employee.phoneNumber1": 1,
          "employee.employeeNumber": 1,
          "employee.numberIdentity": 1,
          "employee.ktpAddress": 1,

          "schedule.timeEntry": 1,
          "schedule.timeOut": 1,
          "schedule.typeSchedule": 1,
          "schedule.delayTolerance": 1,

          "typeAbsence.name": 1,
        },
      },
      {
        $addFields: {
          "employee.gender": {
            $cond: {
              if: { $eq: ["$employee.gender", "L"] },
              then: "laki-laki",
              else: "perempuan",
            },
          },
          dateSchedule: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$dateSchedule",
              },
              timezone: "Asia/Jakarta",
            },
          },
          totalHoursWorked: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$totalHoursWorked",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "schedule.timeEntry": {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$schedule.timeEntry",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "schedule.timeOut": {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$schedule.timeOut",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "schedule.delayTolerance": {
            $dateToString: {
              format: "%M:%S",
              date: {
                $toDate: "$schedule.delayTolerance",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $match: {
          employeeRef: employeeRef,
          dateSchedule: moment().format("DD/MM/YYYY"),
        },
      },
      {
        $limit: 1,
      },
    ]);
    return data[0];
  };

  postCheckIn = async () => {
    const employeeRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.employee._id
    );

    const data: any = await Absence.aggregate([
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
          from: "schedule",
          localField: "scheduleRef",
          foreignField: "_id",
          as: "schedule",
        },
      },
      {
        $unwind: "$schedule",
      },
      {
        $project: {
          employeeRef: 1,
          dateSchedule: 1,
          isWork: 1,
          isPresent: 1,
          entryTime: 1,
          outTime: 1,
          isTooLate: 1,
          isEarlyHome: 1,
          isLeave: 1,
          isOvertime: 1,
          totalHoursWorked: 1,
          totalHoursReal: 1,
          totalHoursLate: 1,
          totalHoursEaryly: 1,
          totalHoursOvertime: 1,
          reasonLate: 1,
          reasonEarly: 1,
          isChangeSchedule: 1,
          isHomeCare: 1,
          isAgree: 1,
          superiorsStatement: 1,
          employeeStatement: 1,

          "employee.name": 1,
          "employee.fullName": 1,
          "employee.gender": 1,
          "employee.phoneNumber1": 1,
          "employee.employeeNumber": 1,
          "employee.numberIdentity": 1,
          "employee.ktpAddress": 1,

          "schedule.timeEntry": 1,
          "schedule.timeOut": 1,
          "schedule.typeSchedule": 1,
          "schedule.delayTolerance": 1,

          "typeAbsence.name": 1,
        },
      },
      {
        $addFields: {
          "employee.gender": {
            $cond: {
              if: { $eq: ["$employee.gender", "L"] },
              then: "laki-laki",
              else: "perempuan",
            },
          },
          dateSchedule: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$dateSchedule",
              },
              timezone: "Asia/Jakarta",
            },
          },
          totalHoursWorked: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$totalHoursWorked",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "schedule.timeEntry": {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$schedule.timeEntry",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "schedule.timeOut": {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$schedule.timeOut",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "schedule.delayTolerance": {
            $dateToString: {
              format: "%M:%S",
              date: {
                $toDate: "$schedule.delayTolerance",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $match: {
          employeeRef: employeeRef,
          dateSchedule: moment().format("DD/MM/YYYY"),
        },
      },
      {
        $limit: 1,
      },
    ]);
    const getData = data[0];

    let startTimeIn = getData.schedule.timeEntry;
    let endTimeOut = getData.schedule.timeOut;
    let tollerance = moment(getData.schedule.delayTolerance, "mm:ss").format(
      "mm"
    );

    let timeInPlus = moment(startTimeIn, "HH:mm").add(tollerance, "minutes");
    let resultTimeIn = timeInPlus.format("HH:mm");

    let getStartTimeIn = moment(startTimeIn, "HH:mm").valueOf();
    let currentTime = moment().valueOf();

    // ketika dibawah jam masuk
    if (currentTime < getStartTimeIn) {
      return {
        status: false,
        message: "Belum bisa absen, waktu masih dibawah jadwal yang ditentukan",
      };
    }

    // apa bila melewati jam pulang
    let getEndTimeOut = moment(endTimeOut, "HH:mm").valueOf();
    if (currentTime > getEndTimeOut) {
      return {
        status: false,
        message:
          "Anda tidak dapat absen, sebab anda terhitung tidak masuk kerja hari ini",
      };
    }

    let isTooLate = false;
    let isPresent = true;
    let entryTime = moment().valueOf();
    let totalHoursLate = null;
    const getResultTimeIn = moment(resultTimeIn, "HH:mm").valueOf();
    if (currentTime > getResultTimeIn) {
      isTooLate = true;

      const currentTimeFormat = moment().format("HH:mm");
      const inTime = moment(resultTimeIn, "HH:mm");
      const comeTime = moment(currentTimeFormat, "HH:mm");
      const secondsDifference = comeTime.diff(inTime, "seconds");
      const hoursLate = Math.floor(secondsDifference / 3600);
      const remainingSeconds = secondsDifference % 3600;
      const minutesLate = Math.floor(remainingSeconds / 60);
      const secondsLate = remainingSeconds % 60;
      const totalLateHours = `${hoursLate}:${minutesLate}:${secondsLate}`;
      totalHoursLate = moment(totalLateHours, "HH:mm:ss").valueOf();
    }

    await Absence.updateOne(
      { _id: getData._id },
      {
        isTooLate,
        isPresent,
        entryTime,
        totalHoursLate,
      }
    );

    const resultData: any = await Absence.aggregate([
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
          from: "schedule",
          localField: "scheduleRef",
          foreignField: "_id",
          as: "schedule",
        },
      },
      {
        $unwind: "$schedule",
      },
      {
        $project: {
          employeeRef: 1,
          dateSchedule: 1,
          isWork: 1,
          isPresent: 1,
          entryTime: 1,
          outTime: 1,
          isTooLate: 1,
          isEarlyHome: 1,
          isLeave: 1,
          isOvertime: 1,
          totalHoursWorked: 1,
          totalHoursReal: 1,
          totalHoursLate: 1,
          totalHoursEaryly: 1,
          totalHoursOvertime: 1,
          reasonLate: 1,
          reasonEarly: 1,
          isChangeSchedule: 1,
          isHomeCare: 1,
          isAgree: 1,
          superiorsStatement: 1,
          employeeStatement: 1,

          "employee.name": 1,
          "employee.fullName": 1,
          "employee.gender": 1,
          "employee.phoneNumber1": 1,
          "employee.employeeNumber": 1,
          "employee.numberIdentity": 1,
          "employee.ktpAddress": 1,

          "schedule.timeEntry": 1,
          "schedule.timeOut": 1,
          "schedule.typeSchedule": 1,
          "schedule.delayTolerance": 1,

          "typeAbsence.name": 1,
        },
      },
      {
        $addFields: {
          "employee.gender": {
            $cond: {
              if: { $eq: ["$employee.gender", "L"] },
              then: "laki-laki",
              else: "perempuan",
            },
          },
          dateSchedule: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$dateSchedule",
              },
              timezone: "Asia/Jakarta",
            },
          },
          totalHoursWorked: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$totalHoursWorked",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "schedule.timeEntry": {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$schedule.timeEntry",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "schedule.timeOut": {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$schedule.timeOut",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "schedule.delayTolerance": {
            $dateToString: {
              format: "%M:%S",
              date: {
                $toDate: "$schedule.delayTolerance",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $match: {
          employeeRef: employeeRef,
          dateSchedule: moment().format("DD/MM/YYYY"),
        },
      },
      {
        $limit: 1,
      },
    ]);

    return {
      status: true,
      message: "Berhasil melakukan absensi",
      result: resultData,
    };
  };
}

export default PresenceService;
