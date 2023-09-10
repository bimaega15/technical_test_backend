import BaseRoutes from "../../../routers/BaseRouter";
import LoginController from "./controller/index";
import validate from "./validation";

// Controllers

class AuthRoutes extends BaseRoutes {
  public routes(): void {
    this.router.post("/login", validate, LoginController.index);
  }
}

export default new AuthRoutes().router;
