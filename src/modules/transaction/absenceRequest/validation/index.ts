import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

const validate = [
  check("leaveBallanceRef").notEmpty().withMessage("Saldo cuti wajib diisi"),
  check("startDateLeave")
    .notEmpty()
    .withMessage("Waktu mulai pengajuan wajib diisi"),
  check("endDateLeave")
    .notEmpty()
    .withMessage("Waktu akhir pengajuan wajib diisi"),
  check("picture").custom(async (value, meta) => {
    const fileData = meta.req.body.picture;
    if (fileData.size > 0) {
      const imageType = fileData.mimetype;
      const size = fileData.size / 1000000;
      const mimeType = [
        "image/jpg",
        "image/jpeg",
        "image/gif",
        "image/png",
        "image/svg+xml",
      ];
      const byte = 5000000 / 1000000;
      const checkType = mimeType.includes(imageType);
      if (!checkType) {
        return Promise.reject(
          "Format file tidak didukung, format yang didukung yaitu: " +
            mimeType.join(",")
        );
      }
      if (size > byte) {
        return Promise.reject("Ukuran picture lebih dari 5 mb ");
      }
    }
  }),
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
