import mongoose from "mongoose";

interface balanceI {
  role: "teacher" | "student";
  userId: mongoose.Types.ObjectId;
  balance: number;
}

const balanceSchema = new mongoose.Schema<balanceI>({
  role: {
    type: String,
    required: true,
    enum: ["student", "teacher"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "role",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: [0, "Balance cannot be negative"],
  },
});

export const balanceModel = mongoose.model<balanceI>("balance", balanceSchema);
