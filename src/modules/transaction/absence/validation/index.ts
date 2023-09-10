import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

const validate = [
  check("employeeRef").notEmpty().withMessage("Pegawai wajib diisi"),
  check("scheduleRef").notEmpty().withMessage("Jenis jadwal wajib diisi"),
  check("dateSchedule").notEmpty().withMessage("Jadwal absen wajib diisi"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send({
        status: 422,
        message: "Perhatikan kembali form anda",
        result: {
          errors: errors.array(),
          request: req.body,
        },
      });
    }

    return next();
  },
];


export default validate;