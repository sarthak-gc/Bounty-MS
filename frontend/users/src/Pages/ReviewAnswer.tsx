import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getSubmission from "../../utils/submission";
import acceptSubmission from "../../utils/acceptSubmission";
import rejectSubmission from "../../utils/rejectSubmission";
import { toast } from "react-toastify";

enum SubmissionStatus {
  Rejected = "Rejected",
  Approved = "Approved",
  Submitted = "Submitted",
  Cancelled = "Cancelled",
}
interface SubmissionI {
  _id: string;
  answer: string;
  bountyId: string;
  status: SubmissionStatus;
  submission: {
    _id: string;
    name: string;
    email: string;
  };
}

const ReviewAnswer = () => {
  const [submission, setSubmission] = useState<SubmissionI | null>(null);
  const { submissionId } = useParams<{ submissionId: string }>();
  const { bountyId } = useParams();

  const [status, setStatus] = useState<SubmissionStatus | null>(null);
  useEffect(() => {
    const fetchSubmission = async () => {
      if (!submissionId) return;

      try {
        const response = await getSubmission(submissionId);
        setSubmission(response.data.submission);
        setStatus(response.data.submission.status);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  if (!submission) {
    return <div className="text-center text-lg">Loading Submission...</div>;
  }

  const fileUrl = submission.answer ? `/uploads/${submission.answer}` : "";

  const handleAccept = async () => {
    if (!bountyId) {
      toast.error("Bounty ID is missing. Please try again.");
      return;
    }

    try {
      await acceptSubmission(submission.submission._id, bountyId);

      toast.success("Submission Accepted Successfully!", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setStatus(SubmissionStatus.Approved);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occured while accepting submission",
        {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      console.error("Error accepting submission:", err);
    }
  };

  const handleReject = async () => {
    if (!bountyId) {
      toast.error("Bounty ID is missing. Please try again.");
      return;
    }

    try {
      await rejectSubmission(submission.submission._id, bountyId);

      toast.success("Submission Rejected Successfully!", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setStatus(SubmissionStatus.Rejected);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occured while rejecting submission",
        {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      console.error("Error rejecting submission:", err);
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen p-6">
      <div className="container mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">
            Review Submission
          </h1>
        </header>

        <div className="bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">
            {submission.submission.name}
          </h2>
          <p className="text-gray-400 mb-4">
            Email: {submission.submission.email}
          </p>

          <div className="mt-4">
            <strong className="text-lg">Answer Content:</strong>
            <div className="mt-2">
              {fileUrl ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Answer
                </a>
              ) : (
                <span className="text-gray-400">No file uploaded</span>
              )}
            </div>
          </div>

          {status === SubmissionStatus.Submitted && (
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleAccept}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Reject
              </button>
            </div>
          )}
          {status === SubmissionStatus.Cancelled && (
            <div className="mt-6 text-gray-400">
              Submission has been cancelled.
            </div>
          )}
          {status === SubmissionStatus.Approved && (
            <div className="mt-6 text-gray-400">
              Submission has already been {status}.
            </div>
          )}
          {status === SubmissionStatus.Rejected && (
            <div className="mt-6 text-gray-400">
              Submission has already been {status}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewAnswer;
