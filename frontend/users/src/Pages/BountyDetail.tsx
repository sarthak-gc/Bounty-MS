import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import bountyInfo from "../../utils/bountyDetail";
import { toast } from "react-toastify";

enum BountyStatus {
  Open = "Open",
  Paused = "Paused",
  Paid = "Paid",
  Expired = "Expired",
}

interface BountyI {
  _id: string;
  expiryDate: string;
  price: number;
  question: string;
  status: BountyStatus;
}
const BountyDetail = () => {
  const { bountyId } = useParams();
  const navigate = useNavigate();
  const [bounty, setBounty] = useState<BountyI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!bountyId) {
      return;
    }

    const fetchBountyDetails = async () => {
      try {
        const response = await bountyInfo(bountyId);
        setBounty(response.data.bounty);
        setLoading(false);

        toast.success("Bounty information retrieved successfully!", {
          position: "top-right",
          autoClose: 1200,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (err) {
        setLoading(false);

        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching the bounty information.";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1200,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    fetchBountyDetails();
  }, [bountyId]);

  if (loading) {
    return (
      <div className="bg-gray-800 w-screen h-screen flex items-center justify-center text-white">
        Loading Bounty Details...
      </div>
    );
  }

  if (!bounty) {
    return (
      <div className="bg-gray-800 w-screen h-screen flex items-center justify-center text-white">
        Bounty not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">
        Bounty Details
      </h1>

      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">{bounty.question}</h2>
        <p className="mt-4 text-lg">
          <strong>Reward:</strong> ${bounty.price}
        </p>
        <p className="mt-2 text-lg">
          <strong>Status:</strong> {bounty.status}
        </p>
        <p className="mt-2 text-lg">
          <strong>Expiry Date:</strong>{" "}
          {new Date(bounty.expiryDate).toLocaleString()}
        </p>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Bounty Description</h3>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate(`/submit-answer/${bountyId}`)}
          className={`px-6 py-3 text-yellow-600  w-full rounded-lg shadow-md text-2xl transition duration-300 ease-in-out transform hover:scale-105 ${
            bounty.status === BountyStatus.Open
              ? "bg-yellow-400"
              : "cursor-not-allowed bg-gray-300"
          }`}
          disabled={bounty.status !== BountyStatus.Open}
        >
          Submit Your Answer
        </button>
      </div>
    </div>
  );
};

export default BountyDetail;
