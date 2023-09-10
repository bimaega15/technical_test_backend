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
    const clientRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.usersRef
    );

    const datas = await Absence.aggregate([
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
          clientRef: 1,
          dateSchedule: 1,
          isWork: 1,
          isPresent: 1,
          entryOfDate: 1,
          outOfDate: 1,
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
        },
      },
      {
        $match: {
          clientRef: clientRef,
        },
      },
    ]);
    return datas;
  };

  store = async () => {
    const { employeeRef, scheduleRef, isSaturdayHoliday, isSundayHoliday } =
      this.body;
    let setSaturdayHoliday =
      isSaturdayHoliday != undefined
        ? isSaturdayHoliday == 1
          ? true
          : false
        : false;
    let setSundayHoliday =
      isSundayHoliday != undefined
        ? isSundayHoliday == 1
          ? true
          : false
        : false;

    // total jam kerja
    let schedule: any = await Schedule.findOne({
      _id: scheduleRef,
    });
    let timeIn = moment.duration(schedule.timeEntry).asSeconds();
    let timeOut = moment.duration(schedule.timeOut).asSeconds();
    let totalHoursWorked: number | string = timeOut - timeIn;
    totalHoursWorked = moment
      .utc(moment.duration(totalHoursWorked, "seconds").asMilliseconds())
      .format("HH:mm:ss");

    const firstDayOfMonth = moment().startOf("month");

    const lastDayOfMonth = moment().endOf("month");

    const currentDate = firstDayOfMonth.clone();
    const datesInMonth = [];

    while (currentDate.isSameOrBefore(lastDayOfMonth)) {
      datesInMonth.push(currentDate.clone());
      currentDate.add(1, "day");
    }

    // Menandai hari Minggu dan Sabtu
    let pushData = [];
    for (let i = 0; i < datesInMonth.length; i++) {
      const date = datesInMonth[i];

      let isWork = true;
      if (date.day() === 0) {
        if (setSundayHoliday) {
          isWork = false;
        }
      }
      if (date.day() === 6) {
        if (setSaturdayHoliday) {
          isWork = false;
        }
      }

      // check data employee
      const checkAbsence = await Absence.countDocuments({
        employeeRef,
        dateSchedule: Helper.convertDate(date.format("DD/MM/YYYY")),
      });
      if (checkAbsence == 0) {
        pushData.push({
          clientRef: this.user.usersRef,
          employeeRef,
          scheduleRef,
          dateSchedule: Helper.convertDate(date.format("DD/MM/YYYY")),
          totalHoursWorked: moment(totalHoursWorked, "HH:mm:ss").valueOf(),
          isWork: isWork,
        });
      }
    }

    var data = null;
    if (pushData.length > 0) {
      data = await Absence.insertMany(pushData);
    }

    return data;
  };

  getOne = async () => {
    const { id } = this.params;
    const refId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

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
          clientRef: 1,
          dateSchedule: 1,
          isWork: 1,
          isPresent: 1,
          entryOfDate: 1,
          outOfDate: 1,
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
        },
      },
      {
        $match: {
          _id: refId,
        },
      },
      {
        $limit: 1,
      },
    ]);

    return data[0];
  };

  update = async () => {
    const { employeeRef, scheduleRef, isSaturdayHoliday, isSundayHoliday } =
      this.body;
    let setSaturdayHoliday =
      isSaturdayHoliday != undefined
        ? isSaturdayHoliday == 1
          ? true
          : false
        : false;
    let setSundayHoliday =
      isSundayHoliday != undefined
        ? isSundayHoliday == 1
          ? true
          : false
        : false;

    // total jam kerja
    let schedule: any = await Schedule.findOne({
      _id: scheduleRef,
    });
    let timeIn = moment.duration(schedule.timeEntry).asSeconds();
    let timeOut = moment.duration(schedule.timeOut).asSeconds();
    let totalHoursWorked: number | string = timeOut - timeIn;
    totalHoursWorked = moment
      .utc(moment.duration(totalHoursWorked, "seconds").asMilliseconds())
      .format("HH:mm:ss");

    const firstDayOfMonth = moment().startOf("month");

    const lastDayOfMonth = moment().endOf("month");

    const currentDate = firstDayOfMonth.clone();
    const datesInMonth = [];

    while (currentDate.isSameOrBefore(lastDayOfMonth)) {
      datesInMonth.push(currentDate.clone());
      currentDate.add(1, "day");
    }

    // Menandai hari Minggu dan Sabtu
    for (let i = 0; i < datesInMonth.length; i++) {
      const date = datesInMonth[i];

      let isWork = true;
      if (date.day() === 0) {
        if (setSundayHoliday) {
          isWork = false;
        }
      }
      if (date.day() === 6) {
        if (setSaturdayHoliday) {
          isWork = false;
        }
      }

      // check data employee
      const checkAbsence = await Absence.countDocuments({
        employeeRef,
        dateSchedule: Helper.convertDate(date.format("DD/MM/YYYY")),
      });
      if (checkAbsence == 0) {
        await Absence.create({
          clientRef: this.user.usersRef,
          employeeRef,
          scheduleRef,
          dateSchedule: Helper.convertDate(date.format("DD/MM/YYYY")),
          totalHoursWorked: moment(totalHoursWorked, "HH:mm:ss").valueOf(),
          isWork: isWork,
        });
      } else {
        const getAbsence: any = await Absence.findOne({
          employeeRef,
          dateSchedule: Helper.convertDate(date.format("DD/MM/YYYY")),
        });

        const data = await Absence.updateOne(
          { _id: getAbsence._id },
          {
            clientRef: this.user.usersRef,
            employeeRef,
            scheduleRef,
            dateSchedule: Helper.convertDate(date.format("DD/MM/YYYY")),
            totalHoursWorked: moment(totalHoursWorked, "HH:mm:ss").valueOf(),
            isWork: isWork,
          }
        );
      }
    }

    return true;
  };

  delete = async () => {
    const { id } = this.params;

    const data = await Absence.deleteOne({ _id: id });
    return data;
  };
}

export default PresenceService;
