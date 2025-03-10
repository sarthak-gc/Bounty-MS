import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import getBounty from "../../utils/individualBounty";

enum BountyStatus {
  Open = "Open",
  Paused = "Paused",
  Paid = "Paid",
  Expired = "Expired",
}
enum SubmissionStatus {
  Rejected = "Rejected",
  Approved = "Approved",
  Submitted = "Submitted",
  Cancelled = "Cancelled",
}

type submissionT = {
  status: SubmissionStatus;
  submission: {
    _id: string;
    name: string;
    email: string;
    answer: string;
  };
};
type BountyT = {
  _id: string;
  expiryDate: string;
  price: number;
  question: string;
  status: BountyStatus;
  studentId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  submissions: submissionT[];
  teacherId: {
    _id: string;
    name: string;
    email: string;
  };
};

const BountyDetails = () => {
  const [bountyDetails, setBountyDetails] = useState<BountyT | null>(null);
  const navigate = useNavigate();
  const { bountyId } = useParams();

  useEffect(() => {
    const fetchBountyDetails = async () => {
      if (!bountyId) {
        navigate("/admin/bounties");
        return;
      }
      try {
        const response = await getBounty(bountyId);
        const data = response.data.data;

        setBountyDetails(data.bounty);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBountyDetails();
  }, [bountyId, navigate]);

  if (!bountyDetails)
    return <div className="text-center text-lg">Loading...</div>;

  const {
    _id,
    expiryDate,
    price,
    question,
    status,
    studentId,
    submissions,
    teacherId,
  } = bountyDetails;

  const statusColorMap: { [key in SubmissionStatus]: string } = {
    [SubmissionStatus.Approved]: "text-green-400",
    [SubmissionStatus.Rejected]: "text-red-400",
    [SubmissionStatus.Submitted]: "text-yellow-400",
    [SubmissionStatus.Cancelled]: "text-red-800",
  };
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-yellow-400 mb-6">
          Bounty Details
        </h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-yellow-300">
              Bounty ID: {_id}
            </h2>
            <p className="text-sm text-yellow-200">
              <strong>Status:</strong> {status}
            </p>
            <p className="text-sm text-yellow-200">
              <strong>Price:</strong> ${price}
            </p>
            <p className="text-sm text-yellow-200">
              <strong>Expiry Date:</strong>{" "}
              {new Date(expiryDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-yellow-200">
              <strong>Question:</strong> {question}
            </p>
          </div>

          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-yellow-100">
              Teacher Information
            </h3>

            <Link
              to={`/teacher/${teacherId._id}`}
              className="text-sm text-yellow-300"
            >
              <strong>Name:</strong> {teacherId.name}
            </Link>
            <p className="text-sm text-yellow-200">
              <strong>Email:</strong> {teacherId.email}
            </p>
          </div>

          {studentId && (
            <div className="bg-gray-700 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-yellow-100">
                Student Information
              </h3>
              <p className="text-sm text-yellow-200">
                <strong>Name:</strong> {studentId.name}
              </p>
              <p className="text-sm text-yellow-200">
                <strong>Email:</strong> {studentId.email}
              </p>
            </div>
          )}

          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-yellow-100">
              Submissions
            </h3>
            {submissions.length > 0 ? (
              <ul className="space-y-2">
                {submissions.map((submission, index) => {
                  return (
                    <li
                      key={index}
                      className="p-2 bg-gray-600 rounded-md flex justify-between"
                    >
                      <span>
                        {submission.submission.name[0].toUpperCase() +
                          submission.submission.name.slice(1)}
                      </span>
                      <span className={`${statusColorMap[submission.status]}`}>
                        {submission.status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-yellow-200">No submissions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BountyDetails;
