import formidable from "formidable";
import BaseRoutes from "../../../routers/BaseRouter";
import { Request, Response, NextFunction } from "express";
import EmployeeController from "./controller/index";
import { validateStore, validateUpdate } from "./validation";
import { verifyToken, gate } from "../../../middleware/index";

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

class EmployeeRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);
    this.router.use(gate(["client"]));


    this.router.get("/", EmployeeController.index);
    this.router.post("/", formData, validateStore, EmployeeController.create);
    this.router.get("/:id", EmployeeController.show);
    this.router.put("/:id", formData, validateUpdate, EmployeeController.update);
    this.router.delete("/:id", EmployeeController.delete);
  }
}

export default new EmployeeRoutes().router;
