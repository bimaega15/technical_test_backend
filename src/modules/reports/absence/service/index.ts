import { Request } from "express";
import Absence from "../../../transaction/absence/model";
import mongoose from "mongoose";
import Helper from "../../../../utils/Helper";
import moment from "moment";
import RegexEscape from "regex-escape";

class ReportAbsenceService {
  body: Request["body"];
  params: Request["params"];
  user: any;
  query: Request["query"];

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
    this.query = req.query;
  }

  getAll = async () => {
    const clientRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.usersMappingRef
    );

    const startDate: string | any = this.query.startDate;
    const endDate: string | any = this.query.endDate;

    const getStartDate = Helper.convertDate(startDate);
    const getEndDate = Helper.convertDate(endDate);

    let whereQuery = {};
    let pushWhere: any[] = [];

    const search: any = this.query.search;
    if (search != null) {
      let keyWordSearch = RegexEscape(search);
      pushWhere = [
        {
          "employee.name": { $regex: keyWordSearch, $options: "mi" },
        },
        {
          "employee.fullName": { $regex: keyWordSearch, $options: "mi" },
        },
        {
          "employee.gender": { $regex: keyWordSearch, $options: "mi" },
        },
        {
          "employee.phoneNumber1": { $regex: keyWordSearch, $options: "mi" },
        },
        {
          "employee.employeeNumber": { $regex: keyWordSearch, $options: "mi" },
        },
        {
          "employee.numberIdentity": { $regex: keyWordSearch, $options: "mi" },
        },
        {
          "employee.ktpAddress": { $regex: keyWordSearch, $options: "mi" },
        },
      ];
    }

    if (startDate != null && endDate != null) {
      pushWhere.push({
        dateSchedule: {
          $gte: getStartDate,
          $lte: getEndDate,
        },
      });
    }

    if (pushWhere.length > 0) {
      whereQuery = { ...whereQuery, $or: pushWhere };
    }

    // const startDate = this.re
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
        $lookup: {
          from: "employee",
          localField: "replacementEmployee",
          foreignField: "_id",
          as: "replacementEmployee",
        },
      },
      {
        $unwind: {
          path: "$replacementEmployee",
          preserveNullAndEmptyArrays: true,
        },
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
        $unwind: {
          path: "$typeAbsence",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          clientRef: 1,
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

          "replacementEmployee.name": 1,
          "replacementEmployee.fullName": 1,
          "replacementEmployee.gender": 1,
          "replacementEmployee.phoneNumber1": 1,
          "replacementEmployee.employeeNumber": 1,
          "replacementEmployee.numberIdentity": 1,
          "replacementEmployee.ktpAddress": 1,

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
          dateScheduleView: {
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
          ...whereQuery,
        },
      },
      {
        $group: {
          _id: "$employeeRef",
          employeeName: { $first: "$employee.name" },
          employeeFullName: { $first: "$employee.fullName" },
          employeeGender: { $first: "$employee.gender" },
          employeePhoneNumber: { $first: "$employee.phoneNumber1" },
          employeeNumber: { $first: "$employee.employeeNumber" },
          employeeNumberIdentity: { $first: "$employee.numberIdentity" },
          employeeKtpAddress: { $first: "$employee.ktpAddress" },

          tooLateCount: { $sum: { $cond: ["$isTooLate", 1, 0] } },

          workCount: { $sum: { $cond: ["$isWork", 1, 0] } },

          leaveCount: { $sum: { $cond: ["$isLeave", 1, 0] } },

          presentCount: { $sum: { $cond: ["$isPresent", 1, 0] } },

          absentCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$isPresent", false] },
                    { $ne: ["$isPresent", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },

          agreeCount: { $sum: { $cond: ["$isAgree", 1, 0] } },

          notApprovedCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$isAgree", false] },
                    { $ne: ["$isAgree", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);
    return datas;
  };
}

export default ReportAbsenceService;
