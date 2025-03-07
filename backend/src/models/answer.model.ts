import mongoose from "mongoose";

enum AnswerStatus {
  Approved = "Approved",
  Rejected = "Rejected",
  Pending = "Pending",
}

interface answerI {
  studentId: mongoose.Types.ObjectId;
  bountyId: mongoose.Types.ObjectId;
  answer: {
    fileName: String;
    path: String;
    mimeType: String;
    size: Number;
  };
  status: AnswerStatus;
  feedback: String;
}

const answerSchema = new mongoose.Schema<answerI>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    bountyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bounty",
      required: true,
    },

    answer: {
      fileName: { type: String, required: true },
      path: { type: String, required: true },
      mimeType: { type: String, required: true },
      size: { type: Number, required: true },
      default: {
        fileName: "",
        path: "",
        mimeType: "",
        size: 0,
      },
    },
    status: {
      type: String,
      enum: Object.values(AnswerStatus),
      default: AnswerStatus.Pending,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const answerModel = mongoose.model<answerI>("answer", answerSchema);
