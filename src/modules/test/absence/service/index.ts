import { Request } from "express";
import Absence from "../../../transaction/absence/model/index";
import mongoose from "mongoose";
import Helper from "../../../../utils/Helper";
import moment from "moment";

class ExecuteAbsenceService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }

  executeAbsence = async () => {
    const clientRef: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      this.user.usersMappingRef
    );
    const currentDate = moment().format("DD/MM/YYYY");
    const getCurrentDate = Helper.convertDate(currentDate);

    await Absence.updateMany(
      {
        clientRef: clientRef,
        isWork: true,
        dateSchedule: {
          $lt: getCurrentDate,
        },
        outTime: {
          $eq: null,
        },
        entryTime: {
          $eq: null,
        },
      },
      {
        $set: {
          isPresent: false,
        },
      }
    );

    return {
      status: true,
      message: "Berhasil eksekusi absensi",
    };
  };
}

export default ExecuteAbsenceService;
