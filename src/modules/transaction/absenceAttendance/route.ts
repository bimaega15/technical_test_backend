import { verifyToken,gate } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import AbsenceAttendanceController from "./controller/index";
import validate from "./validation";

// Controllers
class AbsenceAttendance extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);
    this.router.use(gate(["client"]));

    this.router.get("/", AbsenceAttendanceController.index);
    this.router.get("/:id", AbsenceAttendanceController.show);
    this.router.put("/:id", validate, AbsenceAttendanceController.update);
    this.router.delete("/:id", AbsenceAttendanceController.delete);
  }
}

export default new AbsenceAttendance().router;
