import { verifyToken } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import RequestLeaveController from "./controller/index";
import validate from "./validation";
import { Request, Response, NextFunction } from "express";
import formidable from "formidable";

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

// Controllers
class RequestLeaveRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);
    this.router.get("/", RequestLeaveController.index);
    this.router.post("/", formData, validate, RequestLeaveController.create);
    this.router.get("/history", RequestLeaveController.history);
    this.router.put("/:id", formData, validate, RequestLeaveController.update);
    this.router.delete("/:id", RequestLeaveController.delete);
  }
}

export default new RequestLeaveRoutes().router;
