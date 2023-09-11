import { verifyToken } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import AbsenceRequestController from "./controller/index";
import validate from "./validation";

// Controllers
class AbsenceRequestRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);

    this.router.get("/", AbsenceRequestController.index);
    this.router.get("/:id", AbsenceRequestController.show);
    this.router.put("/:id", validate, AbsenceRequestController.update);
    this.router.delete("/:id", AbsenceRequestController.delete);
  }
}

export default new AbsenceRequestRoutes().router;
