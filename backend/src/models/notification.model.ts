import mongoose from "mongoose";

interface notificationI {
  message: string;
  postedBy: "teacher" | "admin";
  to: "everyone" | "teacher" | "student";
  user: "student" | "teacher";
  seenBy: mongoose.Types.ObjectId[];
}

const notificationSchema = new mongoose.Schema<notificationI>(
  {
    message: String,
    postedBy: {
      type: String,
      enum: ["teacher", "admin"],
      required: true,
    },
    to: {
      type: String,
      required: true,
      enum: ["teacher", "student", "everyone"],
      default: "everyone",
    },
    user: {
      type: String,
      enum: ["student", "teacher"],
    },
    seenBy: {
      type: [mongoose.Schema.Types.ObjectId],
      refPath: "user",
      default: [],
    },
  },
  { timestamps: true }
);

export const notificationModel = mongoose.model<notificationI>(
  "notification",
  notificationSchema
);
