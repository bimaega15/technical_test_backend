import { verifyToken } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import PresenceController from "./controller/index";

// Controllers
class PresenceRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);

    this.router.get("/", PresenceController.index);
    this.router.post("/checkIn", PresenceController.checkIn);
  }
}

export default new PresenceRoutes().router;
