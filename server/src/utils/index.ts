import { Response, Request, NextFunction } from "express";

export const asyncHandler = <T>(
  cb: (req: Request, res: Response, next: NextFunction) => T
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (error: any) {
      let status = error?.status || 500;

      let message = error?.message || "Internal Server Error";

      res.status(status).send({ message });

      console.log("🚀 ~ file: asyncHandler.ts:19 ~ error:", error);
    }
  };
};
