import { Link } from "react-router-dom";
import { useState } from "react";
import changeStatus from "../../utils/changeStatus";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

enum BountyStatus {
  Open = "Open",
  Paused = "Paused",
  Paid = "Paid",
  Expired = "Expired",
}

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
  submissions: string[];
  teacherId: {
    _id: string;
    name: string;
    email: string;
  };
};

interface BountyCardProps {
  elem: BountyT;
}

const BountyCard = ({ elem }: BountyCardProps) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<BountyStatus>(elem.status);

  const changeStatusTo = async (updatedStatus: BountyStatus) => {
    if (!window.confirm("are you sure you want to change the bounty status")) {
      return;
    }
    let statusAction;

    if (updatedStatus === BountyStatus.Open) {
      statusAction = "resume";
    } else if (updatedStatus === BountyStatus.Paused) {
      statusAction = "pause";
    } else {
      toast.error("Invalid Status", {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      setLoading(true);

      await changeStatus(statusAction, elem._id);
      setStatus(updatedStatus);

      toast.success("Status updated successfully!", {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
    } catch (err) {
      let errorMessage = "An error occurred while processing the request.";

      if (err instanceof AxiosError) {
        errorMessage =
          err.response?.data?.message ||
          "An error occurred while communicating with the server.";
      } else if (err instanceof Error) {
        errorMessage = err.message || "An unexpected error occurred.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.error("Error details:", err);
      setLoading(false);
    }
  };

  return (
    <div
      key={elem._id}
      className="rounded-lg overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
    >
      <div className="p-6 bg-black h-96 flex flex-col justify-between">
        <h2 className="text-2xl font-semibold text-yellow-300 overflow-hidden">
          {elem.question}
        </h2>

        <div className="text-xl text-yellow-500 font-semibold">
          ${elem.price}
        </div>

        <div className="text-sm text-gray-400 mt-2">
          <strong>Expiry:</strong>{" "}
          {new Date(elem.expiryDate).toLocaleDateString()}
        </div>

        <div className="font-semibold text-lg mt-4 p-2 rounded-md flex justify-between items-center">
          <span className="text-gray-300">{status}</span>
          <div className="flex space-x-4 mt-2">
            {status === BountyStatus.Open && (
              <button
                onClick={() => changeStatusTo(BountyStatus.Paused)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                disabled={loading}
              >
                Pause Submissions
              </button>
            )}
            {status === BountyStatus.Paused && (
              <button
                onClick={() => changeStatusTo(BountyStatus.Open)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50"
                disabled={loading}
              >
                Resume Submissions
              </button>
            )}
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-300">
          <strong>Submissions:</strong> {elem.submissions.length}
        </div>

        {elem.studentId && (
          <div className="mt-2 text-sm text-gray-300">
            <strong>Accepted Student:</strong> {elem.studentId.name}
          </div>
        )}
        {elem.teacherId && (
          <div className="mt-2 text-sm text-gray-300">
            <strong>Teacher:</strong> {elem.teacherId.name}
          </div>
        )}

        <Link
          to={`/submissions/${elem._id}`}
          className="text-yellow-500 mt-4 inline-block bg-gray-800 p-2 rounded-md text-center hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          View Submissions
        </Link>
      </div>
    </div>
  );
};

export default BountyCard;
