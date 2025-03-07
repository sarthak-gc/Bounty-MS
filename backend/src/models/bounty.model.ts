import mongoose from "mongoose";

export enum BountyStatus {
  Open = "Open",
  Paused = "Paused",
  Paid = "Paid",
  Expired = "Expired",
}

export interface bountyI {
  question: string;
  teacherId: mongoose.Types.ObjectId;
  status: BountyStatus;
  studentId: mongoose.Types.ObjectId;
  price: number;
  submissions: [mongoose.Types.ObjectId];
  expiryDate: Date;
}

const bountySchema = new mongoose.Schema<bountyI>({
  question: String,
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    default: null,
  },
  status: { type: String, enum: Object.values(BountyStatus) },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be a positive number"],
  },

  submissions: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "submission",
  },
  expiryDate: { type: Date, required: true },
});

export const bountyModel = mongoose.model<bountyI>("bounty", bountySchema);
