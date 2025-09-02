import { NextFunction, Request, Response } from "express"

export class TypeMiddleware {
  static validTypes(validTypes: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const type = req.url.split("/").at(2) ?? ""; // aca el middleware no sabe la req, si se usa envolviendo todas las rutas y no una en especifico

      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid type" });
      }

      next();
    };
  }
}
