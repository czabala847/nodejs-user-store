import { Request, Response } from "express"
import { UploadedFile } from "express-fileupload"
import { CustomError } from "../../domain"
import { FileUploadService } from "../services/file-upload.service"

export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  };

  uploadFile = (req: Request, res: Response) => {
    const type = req.params.type;
    // const validTypes = ["users", "products"];

    // if (!validTypes.includes(type)) {
    //   return res.status(400).json({ error: "Invalid type" });
    // }

    const file = req.body.files.at(0) as UploadedFile;

    this.fileUploadService
      .uploadSingle(file as UploadedFile, `uploads/${type}`)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  uploadMultipleFiles = (req: Request, res: Response) => {
    const type = req.params.type;
    const files = req.body.files as UploadedFile[];

    this.fileUploadService
      .uploadMultiple(files, `uploads/${type}`)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };
}
