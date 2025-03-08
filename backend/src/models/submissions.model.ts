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
  accepetedBy?: mongoose.Types.ObjectId | string;
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
    accepetedBy: {
      type: mongoose.Schema.Types.Mixed,
      validate: {
        validator: function (value: string | mongoose.Types.ObjectId) {
          if (value instanceof mongoose.Types.ObjectId) {
            return true;
          }
          return value === "admin";
        },
        message: "accepetedBy must be either an ObjectId or 'admin'.",
      },
      refPath: "acceptedByRef",
    },
    rejectedBy: {
      type: mongoose.Schema.Types.Mixed,
      validate: {
        validator: function (value: string | mongoose.Types.ObjectId) {
          if (value instanceof mongoose.Types.ObjectId) {
            return true;
          }
          return value === "admin";
        },
        message: "rejectedBy must be either an ObjectId or 'admin'.",
      },
      refPath: "rejectedByRef",
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

submissionSchema.virtual("acceptedByRef").get(function () {
  if (this.accepetedBy instanceof mongoose.Types.ObjectId) {
    return "teacher";
  }
  return null;
});

submissionSchema.virtual("rejectedByRef").get(function () {
  if (this.rejectedBy instanceof mongoose.Types.ObjectId) {
    return "teacher";
  }
  return null;
});

export const submissionModel = mongoose.model<submissionI>(
  "submission",
  submissionSchema
);
