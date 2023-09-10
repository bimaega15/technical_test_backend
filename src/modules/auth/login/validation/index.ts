import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

 const validate = [
  check("username").notEmpty().withMessage("Username wajib diisi"),
  check("password").notEmpty().withMessage("Password wajib diisi"),

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
