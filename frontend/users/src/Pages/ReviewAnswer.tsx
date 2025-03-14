import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getSubmission from "../../utils/submission";

interface SubmissionI {
  _id: string;
  answer: string;
  bountyId: string;
  status: string;
  submission: {
    _id: string;
    name: string;
    email: string;
  };
}

const ReviewAnswer = () => {
  const [submission, setSubmission] = useState<SubmissionI | null>(null);
  const { submissionId } = useParams<{ submissionId: string }>();

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!submissionId) return;

      try {
        const response = await getSubmission(submissionId);
        setSubmission(response.data.submission);
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Review Submission</h1>
      <h2 className="text-xl font-semibold">{submission.submission.name}</h2>
      <p className="text-gray-600">Email: {submission.submission.email}</p>

      <div className="mt-2">
        <strong>Answer Content:</strong>
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
            <span>No file uploaded</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewAnswer;
