import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import allBounties from "../../utils/allBounties";
import BountyCard from "../components/BountyCard";

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

const Bounty = () => {
  const [bounties, setBounties] = useState<BountyT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await allBounties();
        setBounties(response.data.bounties);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bounties:", err);
      }
    };

    fetchBounties();
  }, []);

  const handleBountyAdd = () => {
    navigate("/add-bounty");
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen p-6">
      {loading ? (
        <div className="bg-gray-800 w-screen h-screen flex items-center justify-center">
          Loading...
        </div>
      ) : (
        <>
          <header className="grid grid-cols-5 gap-4 mb-4">
            <h1 className="text-4xl font-bold text-yellow-400 col-span-4 flex items-center justify-center">
              Bounties
            </h1>
            <button
              onClick={handleBountyAdd}
              className="text-4xl font-bold text-yellow-400 col-span-1 bg-gray-900 flex items-center justify-center rounded-lg p-4 hover:bg-gray-700 transition duration-300"
            >
              Add Bounty
            </button>
          </header>

          {bounties.length === 0 ? (
            <div className="bg-gray-800 w-screen h-screen flex items-center justify-center">
              No Bounties Found
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-8 md:grid-cols-2">
              {bounties.map((elem) => (
                <BountyCard key={elem._id} elem={elem} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Bounty;
