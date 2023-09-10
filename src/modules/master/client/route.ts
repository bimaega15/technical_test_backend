import { verifyToken } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import ClientController from "./controller/index";
import { validateStore, validateUpdate } from "./validation";

// Controllers

class ClientRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);
    this.router.get("/", ClientController.index);
    this.router.post("/", validateStore, ClientController.create);
    this.router.get("/:id", ClientController.show);
    this.router.put("/:id", validateUpdate, ClientController.update);
    this.router.delete("/:id", ClientController.delete);
  }
}

export default new ClientRoutes().router;
