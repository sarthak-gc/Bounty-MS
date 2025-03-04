import mongoose from "mongoose";

enum Status {
  Resubmission = "Resubmission",
  FirstSubmission = "FirstSubmission",
}
interface submissionI {
  submission: mongoose.Types.ObjectId;
  status: Status;
}

const submissionSchema = new mongoose.Schema<submissionI>(
  {
    submission: mongoose.Schema.Types.ObjectId,
    status: { type: String, enum: Object.values(Status) },
  },
  { timestamps: true }
);

export const submissionModel = mongoose.model("submission", submissionSchema);
