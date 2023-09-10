import { verifyToken } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import StaticsController from "./controller/index";
import validate from "./validation";

// Controllers

class OfficerRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);

    this.router.get("/", StaticsController.index);
    this.router.post("/", validate, StaticsController.create);
    this.router.get("/:id", StaticsController.show);
    this.router.put("/:id", validate, StaticsController.update);
    this.router.delete("/:id", StaticsController.delete);
  }
}

export default new OfficerRoutes().router;
