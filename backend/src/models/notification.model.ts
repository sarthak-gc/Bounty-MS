import mongoose from "mongoose";

interface notificationI {
  postedBy: mongoose.Types.ObjectId;
  message: string;
}

const notificationSchema = new mongoose.Schema<notificationI>(
  {
    postedBy: mongoose.Schema.Types.ObjectId,
    message: String,
  },
  { timestamps: true }
);

export const notificationModel = mongoose.model(
  "notification",
  notificationSchema
);
