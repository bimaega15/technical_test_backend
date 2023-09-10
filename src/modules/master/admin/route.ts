import formidable from "formidable";
import BaseRoutes from "../../../routers/BaseRouter";
import { Request, Response, NextFunction } from "express";
import AdminController from "./controller/index";
import { validateStore, validateUpdate } from "./validation";

// Controllers

const formData = (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({});
  form.parse(req, (err, fields: any, files: any) => {
    for (const key in fields) {
      if (Array.isArray(fields[key]) && fields[key].length === 1) {
        fields[key] = fields[key][0];
      }
    }

    for (const key in files) {
      if (Array.isArray(files[key]) && files[key].length === 1) {
        files[key] = files[key][0];
      }
    }

    req.body = fields;
    req.body.picture = files.picture;
    if (err) {
      next(err);
      return;
    }
    next();
  });
};

class AdminRoutes extends BaseRoutes {
  public routes(): void {
    this.router.get("/", AdminController.index);
    this.router.post("/", formData, validateStore, AdminController.create);
    this.router.get("/:id", AdminController.show);
    this.router.put("/:id", formData, validateUpdate, AdminController.update);
    this.router.delete("/:id", AdminController.delete);
  }
}

export default new AdminRoutes().router;
