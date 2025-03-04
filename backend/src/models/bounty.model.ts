import mongoose from "mongoose";

enum Status {
  Open = "Open",
  InProgress = "InProgress",
  Paused = "Paused",
  Submitted = "Submitted",
  Paid = "Paid",
  Expired = "Expired",
}

interface bountyI {
  teacherId: mongoose.Types.ObjectId;
  status: Status;
  studentId: mongoose.Types.ObjectId;
  price: number;
  submissions: [mongoose.Types.ObjectId];
}

const bountySchema = new mongoose.Schema<bountyI>({
  teacherId: mongoose.Schema.Types.ObjectId,
  status: { type: String, enum: Object.values(Status) },
  studentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  price: Number,
  submissions: { type: [mongoose.Schema.Types.ObjectId], default: [] },
});

export const bountyModel = mongoose.model("bounty", bountySchema);
