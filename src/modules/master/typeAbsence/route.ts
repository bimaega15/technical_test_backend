import { verifyToken, gate } from "../../../middleware/index";
import BaseRoutes from "../../../routers/BaseRouter";
import TypeAbsenceController from "./controller/index";
import validate from "./validation";

// Controllers

class OfficerRoutes extends BaseRoutes {
  public routes(): void {
    this.router.use(verifyToken);
    this.router.use(gate(["client"]));
    
    this.router.get("/", TypeAbsenceController.index);
    this.router.post("/", validate, TypeAbsenceController.create);
    this.router.get("/:id", TypeAbsenceController.show);
    this.router.put("/:id", validate, TypeAbsenceController.update);
    this.router.delete("/:id", TypeAbsenceController.delete);
  }
}

export default new OfficerRoutes().router;
