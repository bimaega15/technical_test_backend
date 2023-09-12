import { Request } from "express";
import RequestAttendance from "../../../staffing/absenceAttendance/model/index";
import mongoose from "mongoose";

class ReportAbsenceService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }

  getAll = async () => {
    return {
      message: "data laporan",
    };
  };
}

export default ReportAbsenceService;
