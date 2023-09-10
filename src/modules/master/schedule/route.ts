import { verifyToken } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import ScheduleController from "./controller/index";
import validate from "./validation";

// Controllers

class ScheduleRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);
    this.router.get("/", ScheduleController.index);
    this.router.post("/", validate, ScheduleController.create);
    this.router.get("/:id", ScheduleController.show);
    this.router.put("/:id", validate, ScheduleController.update);
    this.router.delete("/:id", ScheduleController.delete);
  }
}

export default new ScheduleRoutes().router;
