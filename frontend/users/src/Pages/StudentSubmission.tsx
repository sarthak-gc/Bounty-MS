import { useEffect, useState } from "react";
import selfSubmissions from "../../utils/selfSubmissions";

import { useNavigate } from "react-router-dom";

type BountyT = {
  _id: string;
  price: number;
  status: string;
  question: string;
};

enum submissionStatus {
  Submitted = "Submitted",
  Canceled = "Canceled",
  Approved = "Approved",
  Rejected = "Rejected",
}

type SubmissionT = {
  _id: string;
  bountyId: BountyT;
  status: submissionStatus;
};

const StudentSubmission = () => {
  const [submissions, setSubmissions] = useState<SubmissionT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await selfSubmissions();
        setSubmissions(response.data.submissions);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="bg-gray-800 text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">
        Your Submissions
      </h1>

      {loading ? (
        <div className="bg-gray-800 w-screen h-screen flex items-center justify-center">
          <span>Loading your submissions...</span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-gray-800 w-screen h-screen flex items-center justify-center">
          <span>No submissions found.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission._id}
              className="bg-gray-700 p-6 rounded-lg shadow-md mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-yellow-400">
                  {submission.bountyId.question}
                </h3>
                <span className="text-lg text-yellow-300">
                  Price: ${submission.bountyId.price}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                <p>Status: {submission.status}</p>
                <p>Bounty Status: {submission.bountyId.status}</p>
              </div>

              {submission.status === submissionStatus.Submitted && (
                <button
                  onClick={() => {
                    navigate(
                      `/bounty/${submission.bountyId._id}/answer/${submission._id}`
                    );
                  }}
                  className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-400 transition duration-300"
                >
                  View Details
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSubmission;
