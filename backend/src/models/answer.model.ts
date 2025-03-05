import mongoose from "mongoose";

interface answerI {
  studentId: mongoose.Types.ObjectId;
  bountyId: mongoose.Types.ObjectId;
}

const answerSchema = new mongoose.Schema<answerI>(
  {
    studentId: mongoose.Schema.Types.ObjectId,
    bountyId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

export const answerModel = mongoose.model<answerI>("answer", answerSchema);
