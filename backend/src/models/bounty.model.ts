import mongoose from "mongoose";

export enum BountyStatus {
  Open = "Open",
  Paused = "Paused",
  Paid = "Paid",
  Expired = "Expired",
}

interface bountyI {
  question: string;
  teacherId: mongoose.Types.ObjectId;
  status: BountyStatus;
  studentId: mongoose.Types.ObjectId;
  price: number;
  submissions: [mongoose.Types.ObjectId];
}

const bountySchema = new mongoose.Schema<bountyI>({
  question: String,
  teacherId: mongoose.Schema.Types.ObjectId,
  status: { type: String, enum: Object.values(BountyStatus) },
  studentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  price: Number,
  submissions: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "submission",
  },
});

export const bountyModel = mongoose.model<bountyI>("bounty", bountySchema);
