import { NextFunction, Request, Response } from "express";

export class FIleUploadmiddleware {
  static containFiles(req: Request, res: Response, next: NextFunction) {
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: "No files were selected" });
    }

    if (!Array.isArray(files)) {
      req.body.files = [files.file];
    } else {
      req.body.files = files.file;
    }

    next();
  }
}
