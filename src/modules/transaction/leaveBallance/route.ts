import { verifyToken, gate } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import LeaveBallanceController from "./controller/index";
import validate from "./validation";

// Controllers

class LeaveBallanceRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);
    this.router.use(gate(["client"]));


    this.router.get("/", LeaveBallanceController.index);
    this.router.post("/", validate, LeaveBallanceController.create);
    this.router.get("/:id", LeaveBallanceController.show);
    this.router.put("/:id", validate, LeaveBallanceController.update);
    this.router.delete("/:id", LeaveBallanceController.delete);
  }
}

export default new LeaveBallanceRoutes().router;
