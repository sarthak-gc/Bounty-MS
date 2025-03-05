import mongoose from "mongoose";

export enum BountySubmissionStatus {
  Resubmission = "Resubmission",
  FirstSubmission = "FirstSubmission",
  Approved = "Approved",
  Rejected = "Rejected",
}
interface submissionI {
  bountyId: mongoose.Types.ObjectId;
  submission: mongoose.Types.ObjectId;
  status: BountySubmissionStatus;
  // answer: {
  // fileName: String;
  // path: String;
  // mimeType: String;
  // size: Number;
  // };
}

const submissionSchema = new mongoose.Schema<submissionI>(
  {
    bountyId: { type: mongoose.Schema.Types.ObjectId, ref: "bounty" },
    submission: { type: mongoose.Schema.Types.ObjectId, ref: "student" },
    status: { type: String, enum: Object.values(BountySubmissionStatus) },
    // answer: {
    //   fileName: { type: String },
    //   path: { type: String },
    //   mimeType: { type: String },
    //   size: { type: Number },
    //   default: {
    //     fileName: "",
    //     path: "",
    //     mimeType: "",
    //     size: 0,
    //   },
    // },
  },
  { timestamps: true }
);

export const submissionModel = mongoose.model<submissionI>(
  "submission",
  submissionSchema
);
