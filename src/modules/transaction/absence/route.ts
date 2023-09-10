import { verifyToken } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import AbsenceController from "./controller/index";
import validate from "./validation";

// Controllers

class AbsenceRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);

    this.router.get("/", AbsenceController.index);
    this.router.post("/", validate, AbsenceController.create);
    this.router.get("/:id", AbsenceController.show);
    this.router.put("/:id", validate, AbsenceController.update);
    this.router.delete("/:id", AbsenceController.delete);
  }
}

export default new AbsenceRoutes().router;
