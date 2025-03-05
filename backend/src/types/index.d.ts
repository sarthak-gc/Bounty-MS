import mongoose from "mongoose";

export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        id: mongoose.Types.ObjectId | string;
        role: string;
      };
    }
  }
}
