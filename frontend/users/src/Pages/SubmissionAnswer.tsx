import { useParams } from "react-router-dom";
import submission from "../../utils/submission";
import cancelSubmission from "../../utils/cancelSubmission";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

enum SubmissionStatus {
  Rejected = "Rejected",
  Approved = "Approved",
  Submitted = "Submitted",
  Cancelled = "Cancelled",
}

interface BountyT {
  _id: string;
  question: string;
}

interface DetailsI {
  _id: string;
  answer: string;
  bountyId: BountyT;
  status: SubmissionStatus;
  submission: string;
}

const SubmissionAnswer = () => {
  const [submissionDetails, setSubmissionDetails] = useState<DetailsI | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { submissionId } = useParams();

  const getDetails = async (submissionId: string) => {
    if (!submissionId) return;
    try {
      const response = await submission(submissionId);
      setSubmissionDetails(response.data.submissionDetails);
    } catch (err) {
      console.error("Error fetching submission details:", err);
      toast.error("Error fetching submission details", {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubmission = async (bountyId: string) => {
    try {
      const response = await cancelSubmission(bountyId);
      console.log(response);

      toast.success("Submission canceled successfully!", {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      if (submissionDetails) {
        setSubmissionDetails({
          ...submissionDetails,
          status: SubmissionStatus.Cancelled,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error canceling submission";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error canceling submission:", err);
    }
  };

  useEffect(() => {
    if (submissionId) {
      getDetails(submissionId);
    }
  }, [submissionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!submissionDetails) {
    return <div>No submission details found</div>;
  }

  return (
    <div className="bg-gray-800 text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">
        Submission Details
      </h1>

      <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold text-yellow-400 mb-2">
          {submissionDetails.bountyId.question}
        </h2>
        <p className="text-gray-400 mb-2">
          <strong>Answer:</strong> {submissionDetails.answer}
        </p>
        <p className="text-gray-400 mb-2">
          <strong>Status:</strong> {submissionDetails.status}
        </p>

        {submissionDetails.status === SubmissionStatus.Submitted && (
          <button
            onClick={() =>
              handleCancelSubmission(submissionDetails.bountyId._id)
            }
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-400 transition duration-300"
          >
            Cancel Submission
          </button>
        )}
      </div>
    </div>
  );
};

export default SubmissionAnswer;
