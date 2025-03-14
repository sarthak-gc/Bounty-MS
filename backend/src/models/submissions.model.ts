import mongoose from "mongoose";

export enum BountySubmissionStatus {
  Submitted = "Submitted",
  Cancelled = "Cancelled",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface submissionI {
  bountyId: mongoose.Types.ObjectId;
  submission: mongoose.Types.ObjectId;
  acceptedBy?: mongoose.Types.ObjectId | string;
  rejectedBy?: mongoose.Types.ObjectId | string;
  status: BountySubmissionStatus;
  answer: string;
}

const submissionSchema = new mongoose.Schema<submissionI>(
  {
    bountyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bounty",
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
    },
    status: {
      type: String,
      enum: Object.values(BountySubmissionStatus),
      default: BountySubmissionStatus.Submitted,
    },
    answer: String,
  },
  { timestamps: true }
);

export const submissionModel = mongoose.model<submissionI>(
  "submission",
  submissionSchema
);
