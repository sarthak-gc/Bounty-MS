// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import getSubmissions from "../../utils/allBountySubmissions";

// enum SubmissionStatus {
//   Rejected = "Rejected",
//   Approved = "Approved",
//   Submitted = "Submitted",
//   Cancelled = "Cancelled",
// }

// interface SubmissionI {
//   _id: string;
//   acceptedBy?: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   rejectedBy?: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   answer: string;
//   bountyId: string;
//   status: SubmissionStatus;
//   submittedBy: string;
//   submission: {
//     name: string;
//     email: string;
//   };
// }

// const Submissions = () => {
//   const [submissions, setSubmissions] = useState<SubmissionI[] | null>(null);
//   const navigate = useNavigate();
//   const { bountyId } = useParams();

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       if (!bountyId) {
//         navigate("/bounties");
//         return;
//       }

//       try {
//         const response = await getSubmissions(bountyId);
//         const data = response.data.data;
//         setSubmissions(data.submissions);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchSubmissions();
//   }, [bountyId, navigate]);

//   if (!submissions)
//     return <div className="text-center text-lg">Loading...</div>;

//   const statusColorMap: { [key in SubmissionStatus]: string } = {
//     [SubmissionStatus.Approved]: "text-green-400",
//     [SubmissionStatus.Rejected]: "text-red-400",
//     [SubmissionStatus.Submitted]: "text-yellow-400",
//     [SubmissionStatus.Cancelled]: "text-red-800",
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-semibold mb-4">Submissions for Bounty</h1>
//       {submissions.length === 0 ? (
//         <h1>No submissions found</h1>
//       ) : (
//         <div className="space-y-4">
//           {submissions.map((submission) => (
//             <div
//               key={submission._id}
//               className="p-4 border rounded-lg shadow-md"
//             >
//               <h3 className="text-xl font-semibold">
//                 {submission.submission.name}
//               </h3>
//               <p className="text-gray-600">
//                 Email: {submission.submission.email}
//               </p>
//               <div className="mt-2">
//                 <strong>Answer:</strong>
//                 <p>{submission.answer.split("/").pop()}</p>{" "}
//               </div>
//               <div className="mt-2 flex items-center">
//                 <span
//                   className={`py-1 px-3 rounded-full ${
//                     statusColorMap[submission.status]
//                   }`}
//                 >
//                   {submission.status}
//                 </span>
//               </div>
//               {submission.acceptedBy && (
//                 <p className="text-sm text-green-600">
//                   Accepted By: {submission.acceptedBy.name}
//                 </p>
//               )}
//               {submission.rejectedBy && (
//                 <p className="text-sm text-red-600">
//                   Rejected By: {submission.rejectedBy.name}
//                 </p>
//               )}
//               <div className="mt-2">
//                 <button
//                   onClick={() => navigate(`review-answer/${submission._id}`)}
//                   className="text-blue-600 hover:underline"
//                 >
//                   Review Answer
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Submissions;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getSubmissions from "../../utils/allBountySubmissions";

enum SubmissionStatus {
  Rejected = "Rejected",
  Approved = "Approved",
  Submitted = "Submitted",
  Cancelled = "Cancelled",
}

interface SubmissionI {
  _id: string;
  acceptedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  rejectedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  answer: string;
  bountyId: string;
  status: SubmissionStatus;
  submittedBy: string;
  submission: {
    name: string;
    email: string;
  };
}

const Submissions = () => {
  const [submissions, setSubmissions] = useState<SubmissionI[] | null>(null);
  const navigate = useNavigate();
  const { bountyId } = useParams();

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!bountyId) {
        navigate("/bounties");
        return;
      }

      try {
        const response = await getSubmissions(bountyId);
        const data = response.data.data;
        setSubmissions(data.submissions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSubmissions();
  }, [bountyId, navigate]);

  if (!submissions)
    return (
      <div className="bg-gray-800 w-screen h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  const statusColorMap: { [key in SubmissionStatus]: string } = {
    [SubmissionStatus.Approved]: "text-green-400",
    [SubmissionStatus.Rejected]: "text-red-400",
    [SubmissionStatus.Submitted]: "text-yellow-400",
    [SubmissionStatus.Cancelled]: "text-red-800",
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen p-6">
      <div className="container mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">
            Submissions for Bounty
          </h1>
        </header>

        {submissions.length === 0 ? (
          <div className="text-center text-lg">No submissions found</div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-gray-700 p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold">
                  {submission.submission.name}
                </h3>
                <p className="text-gray-400">
                  Email: {submission.submission.email}
                </p>

                <div className="mt-4">
                  <strong>Answer:</strong>
                  <p>{submission.answer.split("/").pop()}</p>
                </div>

                <div className="mt-4 flex items-center">
                  <span
                    className={`py-1 px-3 rounded-full ${
                      statusColorMap[submission.status]
                    }`}
                  >
                    {submission.status}
                  </span>
                </div>

                {submission.acceptedBy && (
                  <p className="text-sm text-green-600 mt-2">
                    Accepted By: {submission.acceptedBy.name}
                  </p>
                )}

                {submission.rejectedBy && (
                  <p className="text-sm text-red-600 mt-2">
                    Rejected By: {submission.rejectedBy.name}
                  </p>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => navigate(`review-answer/${submission._id}`)}
                    className="text-blue-600 hover:underline transition duration-300"
                  >
                    Review Answer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;
