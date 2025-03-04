import mongoose from "mongoose";

interface balanceI {
  userId: mongoose.Types.ObjectId;
  balance: number;
}

const balanceSchema = new mongoose.Schema<balanceI>({
  userId: mongoose.Schema.Types.ObjectId,
  balance: Number,
});

export const balanceModel = mongoose.model("balance", balanceSchema);
