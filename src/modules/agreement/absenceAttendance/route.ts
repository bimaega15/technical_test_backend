import { verifyToken } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import AbsenceAttendanceController from "./controller/index";

// Controllers
class AbsenceAttendanceRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);

    this.router.get("/", AbsenceAttendanceController.index);
    this.router.get("/:id", AbsenceAttendanceController.show);
    this.router.put("/:id", AbsenceAttendanceController.update);
  }
}

export default new AbsenceAttendanceRoutes().router;
