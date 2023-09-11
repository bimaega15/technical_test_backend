import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import { config as dotenv } from "dotenv";
import * as path from "path";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import { development } from "./config/database";
import mongoose, { ConnectOptions } from "mongoose";
import momentTimezone from "moment-timezone";

// for admin
import adminRoutes from "./modules/master/admin/route";
// for auth
import authRoutes from "./modules/auth/login/route";
// for client
import clientRoutes from "./modules/master/client/route";

// for data-client
import scheduleRoutes from "./modules/master/schedule/route";
import staticsRoutes from "./modules/master/statics/route";
import typeAbsenceRoutes from "./modules/master/typeAbsence/route";
import typeLeaveRoutes from "./modules/master/typeLeave/route";
import employeeRoutes from "./modules/master/employee/route";

// for data-pegawai
import absenceRoutes from "./modules/transaction/absence/route";
import leaveBallanceRoutes from "./modules/transaction/leaveBallance/route";
import absenceRequestRoutes from "./modules/transaction/absenceRequest/route";
import absenceAttendanceRoutes from "./modules/transaction/absenceAttendance/route";

// for pegawai-execute
import staffingRoutes from "./modules/staffing/presence/route";
import staffingAbsenceRoutes from "./modules/staffing/requestLeave/route";
import staffingAbsenceAttendanceRoutes from "./modules/staffing/absenceAttendance/route";

// agreement
import agreementAbsenceRoutes from "./modules/agreement/absenceRequest/route";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.connectDb();
    this.routes();
    dotenv();
  }

  protected plugins(): void {
    this.app.set("views", path.join(__dirname, "src/views"));
    this.app.set("view engine", "ejs");

    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, "src/public")));

    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
    momentTimezone.tz.setDefault("Asia/Jakarta");
  }

  protected connectDb(): void {
    mongoose
      .connect(development(), {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      } as ConnectOptions)
      .then((res) => {
        console.log("Connect to database " + development());
      })
      .catch((err) => {
        console.log(err.message);
        console.log("Failed to connect " + development());
      });
  }

  protected routes(): void {
    // master
    this.app.use("/api/master/admin", adminRoutes);
    this.app.use("/api/master/client", clientRoutes);
    this.app.use("/api/master/schedule", scheduleRoutes);
    this.app.use("/api/master/statics", staticsRoutes);
    this.app.use("/api/master/typeAbsence", typeAbsenceRoutes);
    this.app.use("/api/master/typeLeave", typeLeaveRoutes);
    this.app.use("/api/master/employee", employeeRoutes);

    // transaction
    this.app.use("/api/transaction/absence", absenceRoutes);
    this.app.use("/api/transaction/leaveBallance", leaveBallanceRoutes);
    this.app.use("/api/transaction/absenceRequest", absenceRequestRoutes);
    this.app.use("/api/transaction/absenceAttendance", absenceAttendanceRoutes);

    // auth
    this.app.use("/api/auth", authRoutes);

    // staffing
    this.app.use("/api/staffing/presence", staffingRoutes);
    this.app.use("/api/staffing/absenceRequest", staffingAbsenceRoutes);
    this.app.use(
      "/api/staffing/absenceAttendance",
      staffingAbsenceAttendanceRoutes
    );

    // agreement
    this.app.use("/api/agreement/absenceRequest", agreementAbsenceRoutes);

    this.app.use(function (req, res, next) {
      next(createError(404));
    });

    this.app.use(function (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ): any {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(500);
      res.render("error");
    });
  }
}

const app = new App().app;
export default app;
