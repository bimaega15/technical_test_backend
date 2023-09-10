import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

const validate = [
  check("typeLeaveRef").notEmpty().withMessage("Jenis cuti wajib diisi"),
  check("employeeRef").notEmpty().withMessage("Pegawai wajib diisi"),
  check("earlyPeriod").notEmpty().withMessage("Periode awal wajib diisi"),
  check("endPeriod").notEmpty().withMessage("Periode akhir wajib diisi"),
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
