import { verifyToken, gate } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import PresenceController from "./controller/index";

// Controllers
class PresenceRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);
    this.router.use(gate(["employee"]));

    this.router.get("/", PresenceController.index);
    this.router.post("/checkIn", PresenceController.checkIn);
    this.router.post("/checkOut", PresenceController.checkOut);
    this.router.get("/history", PresenceController.history);
  }
}

export default new PresenceRoutes().router;
