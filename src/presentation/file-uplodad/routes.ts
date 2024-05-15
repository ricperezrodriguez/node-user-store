import { Router } from "express";
import { FIleUploadmiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";
import { FileUploadService } from "../services/file-upload.service";
import { FileUploadController } from "./controller";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

    const controller = new FileUploadController(new FileUploadService());

    router.use(FIleUploadmiddleware.containFiles);
    router.use(TypeMiddleware.validTypes(["users", "products", "categories"]));

    router.post("/single/:type", controller.uploadFile);
    router.post("/multiple/:type", controller.uploadMultipleFiles);

    return router;
  }
}
