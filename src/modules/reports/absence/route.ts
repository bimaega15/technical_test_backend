import { verifyToken, gate } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import ReportAbsenceController from "./controller/index";

// Controllers
class ReportAbsenceRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);
    this.router.use(gate(["client"]));

    this.router.get("/", ReportAbsenceController.index);
  }
}

export default new ReportAbsenceRoutes().router;
