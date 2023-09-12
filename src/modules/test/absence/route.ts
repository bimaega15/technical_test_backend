import { verifyToken, gate } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import ExecuteAbsenceController from "./controller/index";

// Controllers
class ExecuteAbsenceRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);
    this.router.use(gate(["client"]));

    this.router.post("/", ExecuteAbsenceController.index);
  }
}

export default new ExecuteAbsenceRoutes().router;
