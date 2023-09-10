import BaseRoutes from "../../../routers/BaseRouter";
import RegisterController from "./controller/index";

// Controllers

class OfficerRoutes extends BaseRoutes {
  public routes(): void {
    this.router.get("/", RegisterController.index);
    this.router.post("/", RegisterController.create);
    this.router.get("/:id", RegisterController.show);
    this.router.put("/:id", RegisterController.update);
    this.router.delete("/:id", RegisterController.delete);
  }
}

export default new OfficerRoutes().router;
