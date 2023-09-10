import { verifyToken } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import PresenceController from "./controller/index";

// Controllers
class PresenceRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);

    this.router.get("/", PresenceController.index);
    this.router.post("/", PresenceController.create);
    this.router.get("/:id", PresenceController.show);
    this.router.put("/", PresenceController.update);
    this.router.delete("/:id", PresenceController.delete);
  }
}

export default new PresenceRoutes().router;
