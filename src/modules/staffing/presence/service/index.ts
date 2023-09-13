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

  protected getScheduleOneFunction = async (whereCondition: Object = {}) => {
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
          "schedule.attendanceTimeTolerance": 1,

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
          entryTime: {
            $dateToString: {
              format: "%d/%m/%Y %H:%M",
              date: {
                $toDate: "$entryTime",
              },
              timezone: "Asia/Jakarta",
            },
          },
          outTime: {
            $dateToString: {
              format: "%d/%m/%Y %H:%M",
              date: {
                $toDate: "$outTime",
              },
              timezone: "Asia/Jakarta",
            },
          },
          totalHoursLate: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$totalHoursLate",
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
          totalHoursEaryly: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$totalHoursEaryly",
              },
              timezone: "Asia/Jakarta",
            },
          },
          totalHoursReal: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$totalHoursReal",
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
          "schedule.attendanceTimeTolerance": {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$schedule.attendanceTimeTolerance",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $match: {
          ...whereCondition,
        },
      },
      {
        $limit: 1,
      },
    ]);
    return data[0];
  };

  protected getScheduleManyFunction = async (whereCondition: Object = {}) => {
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
          "schedule.attendanceTimeTolerance": 1,

          "typeAbsence.name": 1,
        },
      },
      {
        $addFields: {
          entryTime: {
            $dateToString: {
              format: "%d/%m/%Y %H:%M",
              date: {
                $toDate: "$entryTime",
              },
              timezone: "Asia/Jakarta",
            },
          },
          outTime: {
            $dateToString: {
              format: "%d/%m/%Y %H:%M",
              date: {
                $toDate: "$outTime",
              },
              timezone: "Asia/Jakarta",
            },
          },
          totalHoursLate: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$totalHoursLate",
              },
              timezone: "Asia/Jakarta",
            },
          },
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
          totalHoursEaryly: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$totalHoursEaryly",
              },
              timezone: "Asia/Jakarta",
            },
          },
          totalHoursReal: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$totalHoursReal",
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
          "schedule.attendanceTimeTolerance": {
            $dateToString: {
              format: "%H:%M",
              date: {
                $toDate: "$schedule.attendanceTimeTolerance",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $match: {
          ...whereCondition,
        },
      },
    ]);
    return data;
  };

  protected getMustSchedule: any = async () => {
    const employeeRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.employee._id
    );

    const currentBeforeDate = moment().subtract(1, "days").format("DD/MM/YYYY");
    const checkBeforeSchedule = await this.getScheduleOneFunction({
      dateSchedule: currentBeforeDate,
      employeeRef: employeeRef,
      isWork: true,

      isChangeSchedule: {
        $ne: true,
      },
      replacementEmployee: {
        $eq: null,
      },
    });

    const getBeforeAttendanceTimeTolerance =
      checkBeforeSchedule.schedule.attendanceTimeTolerance;
    const getBeforeValueAttendanceTimeTolerance = moment(
      getBeforeAttendanceTimeTolerance,
      "HH:mm"
    ).valueOf();

    const getBeforeDelayTollerance = moment(
      checkBeforeSchedule.schedule.delayTolerance,
      "mm:ss"
    ).format("mm");
    const getBeforeTimeEntryPlusTollerance = moment(
      checkBeforeSchedule.schedule.timeEntry,
      "HH:mm"
    )
      .add(getBeforeDelayTollerance, "minutes")
      .format("HH:mm");

    const getBeforeTimeEntry =
      checkBeforeSchedule.dateSchedule + " " + getBeforeTimeEntryPlusTollerance;

    const getCurrentTime = moment().format("DD/MM/YYYY HH:mm");

    const valueBeforeRangeTime = moment(getBeforeTimeEntry, "DD/MM/YYYY HH:mm");
    const valueCurrentTime = moment(getCurrentTime, "DD/MM/YYYY HH:mm");
    const getRangeBeforeTimeMinutes = valueCurrentTime.diff(
      valueBeforeRangeTime,
      "minutes"
    );
    const durationBeforeTime = moment.duration(
      getRangeBeforeTimeMinutes,
      "minutes"
    );
    const formatDurationBeforeTime = `${Math.floor(
      durationBeforeTime.asHours()
    )}:${durationBeforeTime.minutes()}`;
    const valueBeforeDuration = moment(
      formatDurationBeforeTime,
      "HH:mm"
    ).valueOf();

    let executeSchedule = null;
    if (valueBeforeDuration < getBeforeValueAttendanceTimeTolerance) {
      executeSchedule = checkBeforeSchedule.dateSchedule;
    } else {
      executeSchedule = moment().format("DD/MM/YYYY");
    }

    return {
      status: true,
      message: "Berhasil ambil data tanggal",
      result: {
        startTime: executeSchedule,
        endTime: moment().format("DD/MM/YYYY"),
      },
    };
  };

  getSchedule = async () => {
    const employeeRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.employee._id
    );

    const executeSchedule = await this.getMustSchedule();

    const executeData = await this.getScheduleOneFunction({
      dateSchedule: executeSchedule.result.startTime,
      employeeRef: employeeRef,
    });
    return executeData;
  };

  getHistory = async () => {
    const employeeRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.employee._id
    );

    const datas = await this.getScheduleManyFunction({
      employeeRef: employeeRef,
    });
    return datas;
  };

  postCheckIn = async () => {
    const employeeRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.employee._id
    );
    const executeSchedule = await this.getMustSchedule();

    // check is checkin
    const checkAbsenceOut = await Absence.aggregate([
      {
        $addFields: {
          dateSchedule: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$dateSchedule",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $match: {
          employeeRef: employeeRef,
          dateSchedule: executeSchedule.result.startTime,
          entryTime: { $ne: null },
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (checkAbsenceOut.length > 0) {
      return {
        status: false,
        message: "Anda sudah melakukan absensi, sebelumnya",
      };
    }

    const data = await this.getScheduleOneFunction({
      dateSchedule: executeSchedule.result.startTime,
      employeeRef: employeeRef,
    });
    const getData = data;

    let startTimeIn =
      executeSchedule.result.startTime + " " + getData.schedule.timeEntry;
    let endTimeOut =
      executeSchedule.result.endTime + " " + getData.schedule.timeOut;

    let tollerance = moment(getData.schedule.delayTolerance, "mm:ss").format(
      "mm"
    );

    let timeInPlus = moment(startTimeIn, "DD/MM/YYYY HH:mm").add(
      tollerance,
      "minutes"
    );
    let resultTimeIn = timeInPlus.format("DD/MM/YYYY HH:mm");

    let getStartTimeIn = moment(startTimeIn, "DD/MM/YYYY HH:mm").valueOf();
    let currentTime = moment().valueOf();

    // ketika dibawah jam masuk
    if (currentTime < getStartTimeIn) {
      return {
        status: false,
        message: "Belum bisa absen, waktu masih dibawah jadwal yang ditentukan",
      };
    }

    // apa bila melewati jam pulang
    let getEndTimeOut = moment(endTimeOut, "DD/MM/YYYY HH:mm").valueOf();

    if (currentTime > getEndTimeOut) {
      await Absence.updateOne(
        { _id: getData._id },
        {
          isPresent: false,
        }
      );

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
    const getResultTimeIn = moment(resultTimeIn, "DD/MM/YYYY HH:mm").valueOf();

    if (currentTime > getResultTimeIn) {
      isTooLate = true;

      const currentTimeFormat = moment().format("DD/MM/YYYY HH:mm");
      const inTime = moment(resultTimeIn, "DD/MM/YYYY HH:mm");
      const comeTime = moment(currentTimeFormat, "DD/MM/YYYY HH:mm");
      const secondsDifference = comeTime.diff(inTime, "seconds");
      const hoursLate = Math.floor(secondsDifference / 3600);
      const remainingSeconds = secondsDifference % 3600;
      const minutesLate = Math.floor(remainingSeconds / 60);
      const secondsLate = remainingSeconds % 60;
      const totalLateHours =
        executeSchedule.result.endTime +
        " " +
        `${hoursLate}:${minutesLate}:${secondsLate}`;

      totalHoursLate = moment(totalLateHours, "DD/MM/YYYY HH:mm:ss").valueOf();
    }

    // update absence
    await Absence.updateOne(
      { _id: getData._id },
      {
        isTooLate,
        isPresent,
        entryTime,
        totalHoursLate,
      }
    );

    // get data absence today
    const resultData: any = await this.getScheduleOneFunction({
      employeeRef: employeeRef,
      dateSchedule: executeSchedule.result.startTime,
    });

    return {
      status: true,
      message: "Berhasil melakukan checkin absensi",
      result: resultData,
    };
  };

  postCheckOut = async () => {
    const employeeRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.employee._id
    );

    const executeSchedule = await this.getMustSchedule();

    // check is checkin
    const checkAbsenceOut = await Absence.aggregate([
      {
        $addFields: {
          dateSchedule: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$dateSchedule",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $match: {
          employeeRef: employeeRef,
          dateSchedule: executeSchedule.result.endTime,
          outTime: { $ne: null },
        },
      },
      {
        $limit: 1,
      },
    ]);
    if (checkAbsenceOut.length > 0) {
      return {
        status: false,
        message: "Anda sudah checkout sebelumnya",
      };
    }

    const getData = await this.getScheduleOneFunction({
      employeeRef: employeeRef,
      dateSchedule: executeSchedule.result.startTime,
    });

    let inTimeOut = getData.entryTime;
    let endTimeOut =
      executeSchedule.result.endTime + " " + getData.schedule.timeOut;

    // apa bila melewati jam pulang
    let currentTime = moment().valueOf();
    let getEndTimeOut = moment(endTimeOut, "DD/MM/YYYY HH:mm").valueOf();

    let isEarlyHome = false;
    let totalHoursEaryly = null;

    if (currentTime < getEndTimeOut) {
      isEarlyHome = true;

      const currentTimeFormat = moment().format("DD/MM/YYYY HH:mm");
      const outTime = moment(endTimeOut, "DD/MM/YYYY HH:mm");
      const comeTimeOut = moment(currentTimeFormat, "DD/MM/YYYY HH:mm");

      const secondsDifference = outTime.diff(comeTimeOut, "seconds");
      const hoursLate = Math.floor(secondsDifference / 3600);
      const remainingSeconds = secondsDifference % 3600;
      const minutesLate = Math.floor(remainingSeconds / 60);
      const secondsLate = remainingSeconds % 60;
      const totalEarlyHours =
        executeSchedule.result.endTime +
        " " +
        `${hoursLate}:${minutesLate}:${secondsLate}`;
      totalHoursEaryly = moment(
        totalEarlyHours,
        "DD/MM/YYYY HH:mm:ss"
      ).valueOf();
    }

    const currentTimeFormat = moment().format("DD/MM/YYYY HH:mm");
    const comeTimeOut = moment(currentTimeFormat, "DD/MM/YYYY HH:mm");
    const setTimeIn = moment(inTimeOut, "DD/MM/YYYY HH:mm");
    const secondsDifference = comeTimeOut.diff(setTimeIn, "seconds");
    const hoursLate = Math.floor(secondsDifference / 3600);
    const remainingSeconds = secondsDifference % 3600;
    const minutesLate = Math.floor(remainingSeconds / 60);
    const secondsLate = remainingSeconds % 60;
    const totalHoursRealResult =
      executeSchedule.result.endTime +
      " " +
      `${hoursLate}:${minutesLate}:${secondsLate}`;
    const totalHoursReal = moment(
      totalHoursRealResult,
      "DD/MM/YYYY HH:mm:ss"
    ).valueOf();

    // // update absence
    const outTime = moment().valueOf();
    await Absence.updateOne(
      { _id: getData._id },
      {
        outTime,
        isEarlyHome,
        totalHoursReal,
        totalHoursEaryly,
      }
    );

    // // get data absence today
    const resultData: any = await this.getScheduleOneFunction({
      employeeRef: employeeRef,
      dateSchedule: executeSchedule.result.endTime,
    });

    return {
      status: true,
      message: "Berhasil melakukan checkout absensi",
      result: resultData,
    };
  };
}

export default PresenceService;
