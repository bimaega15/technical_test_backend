import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";


const validate = [
  check("timeEntry").notEmpty().withMessage("Waktu masuk wajib diisi"),
  check("timeOut").notEmpty().withMessage("Waktu keluar wajib diisi"),
  check("color").notEmpty().withMessage("Color wajib diisi"),
  check("typeSchedule").notEmpty().withMessage("Jenis jadwal wajib diisi"),
  check("delayTolerance").notEmpty().withMessage("Toleransi Keterlambatan wajib diisi"),
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