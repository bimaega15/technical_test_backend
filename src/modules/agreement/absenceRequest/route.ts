import { verifyToken, gate } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import AbsenceRequestController from "./controller/index";

// Controllers
class AbsenceRequestRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);
    this.router.use(gate(["employee"]));

    this.router.get("/", AbsenceRequestController.index);
    this.router.get("/:id", AbsenceRequestController.show);
    this.router.put("/:id", AbsenceRequestController.update);
  }
}

export default new AbsenceRequestRoutes().router;
