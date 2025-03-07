import mongoose from "mongoose";

export enum TransactionStatus {
  Pending = "Pending",
  Completed = "Completed",
  Failed = "Failed",
  Rejected = "Rejected",
}

interface TransactionI {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  bountyId: mongoose.Types.ObjectId;
  amount: number;
  status: TransactionStatus;
}

const transactionSchema = new mongoose.Schema<TransactionI>(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "student" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "teacher" },
    bountyId: { type: mongoose.Schema.Types.ObjectId, ref: "bounty" },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.Pending,
    },
  },
  { timestamps: true }
);

export const transacitonModel = mongoose.model(
  "transaction",
  transactionSchema
);
