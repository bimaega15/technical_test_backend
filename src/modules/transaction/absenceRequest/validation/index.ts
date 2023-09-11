import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

const validate = [
  check("employeeChangeRef")
    .notEmpty()
    .withMessage("Pegawai pengganti wajib diisi"),
  check("superiorRef").notEmpty().withMessage("Atasan wajib diisi"),
  check("information").notEmpty().withMessage("Informasi wajib diisi"),

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
