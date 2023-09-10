import { verifyToken } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import TypeLeaveController from "./controller/index";
import validate from "./validation";

// Controllers

class TypeLeaveRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);

    this.router.get("/", TypeLeaveController.index);
    this.router.post("/", validate, TypeLeaveController.create);
    this.router.get("/:id", TypeLeaveController.show);
    this.router.put("/:id", validate, TypeLeaveController.update);
    this.router.delete("/:id", TypeLeaveController.delete);
  }
}

export default new TypeLeaveRoutes().router;
