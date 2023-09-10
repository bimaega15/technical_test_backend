import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import Users from "../../users/model";
import UsersMapping from "../../usersMapping/model";

export const validateStore = [
  check("email").isEmail().withMessage("Email tidak valid"),
  check("email").custom(async (value, meta) => {
    const countData = await Users.countDocuments({
      email: value,
    });
    if (countData > 0) {
      return Promise.reject("Email sudah digunakan");
    }
  }),

  check("username").notEmpty().withMessage("Username wajib diisi"),
  check("username").custom(async (value, meta) => {
    const countData = await Users.countDocuments({
      username: value,
    });
    if (countData > 0) {
      return Promise.reject("Username sudah digunakan");
    }
  }),

  check("password").notEmpty().withMessage("Password wajib diisi"),
  check("password_confirm").custom(async (value, meta) => {
    const body = meta.req.body;
    if (body.password_confirm != value) {
      return Promise.reject("Password tidak sama");
    }
  }),

  check("name").notEmpty().withMessage("Nama wajib diisi"),
  check("phoneNumber").isNumeric().withMessage("Harus berupa angka"),
  check("phoneNumber").notEmpty().withMessage("No. Telepon wajib diisi"),
  check("gender").notEmpty().withMessage("Gender wajib diisi"),
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

export const validateUpdate = [
  check("email").isEmail().withMessage("Email tidak valid"),
  check("email").custom(async (value, meta) => {
    const { id }: any = meta.req.params;
    const usersMapping: any = await UsersMapping.findOne({
      _id: id,
    });

    const countData = await Users.countDocuments({
      email: value,
      _id: { $ne: usersMapping.usersRef },
    });
    if (countData > 0) {
      return Promise.reject("Email sudah digunakan");
    }
  }),

  check("username").notEmpty().withMessage("Username wajib diisi"),
  check("username").custom(async (value, meta) => {
    const { id }: any = meta.req.params;
    const usersMapping: any = await UsersMapping.findOne({
      _id: id,
    });

    const countData = await Users.countDocuments({
      username: value,
      _id: { $ne: usersMapping.usersRef },
    });
    if (countData > 0) {
      return Promise.reject("Username sudah digunakan");
    }
  }),

  check("password").notEmpty().withMessage("Password wajib diisi"),
  check("password_confirm").custom(async (value, meta) => {
    const body = meta.req.body;
    if (body.password_confirm != value) {
      return Promise.reject("Password tidak sama");
    }
  }),

  check("name").notEmpty().withMessage("Nama wajib diisi"),
  check("phoneNumber").isNumeric().withMessage("Harus berupa angka"),
  check("phoneNumber").notEmpty().withMessage("No. Telepon wajib diisi"),
  check("gender").notEmpty().withMessage("Gender wajib diisi"),
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
