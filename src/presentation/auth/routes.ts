import { Router } from "express"
import { envs } from "../../config"
import { AuthService, EmailService } from "../services"
import { AuthController } from "./controller"

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY
    );
    const authService = new AuthService(emailService);
    const controller = new AuthController(authService);

    // Definir las rutas
    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);
    router.post("/validate-email/:token", controller.validateEmail);

    return router;
  }
}
