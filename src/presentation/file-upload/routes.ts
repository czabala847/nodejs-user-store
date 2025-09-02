import { Router } from "express"
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware"
import { TypeMiddleware } from "../middlewares/type.middleware"
import { FileUploadService } from "../services/file-upload.service"
import { FileUploadController } from "./controller"

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

    const fileUploadService = new FileUploadService();
    const controller = new FileUploadController(fileUploadService);

    // Definir las rutas

    router.use([
      FileUploadMiddleware.containFiles,
      TypeMiddleware.validTypes(["users", "products"]),
    ]);

    router.post("/single/:type", controller.uploadFile);
    router.post("/multiple/:type", controller.uploadMultipleFiles);

    return router;
  }
}
