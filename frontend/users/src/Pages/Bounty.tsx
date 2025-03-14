import { useEffect, useState } from "react";
import allBounties from "../../utils/allBounties";
import BountyCard from "../components/BountyCard.tsx";
// import { logout } from "../../utils/login.ts";

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

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await allBounties();

        setBounties(response.data.bounties);

        setLoading(false);
      } catch (err) {
        // if (err.message.toLowerCase() === "user not found") {
        //   logout();
        // }
        console.error("Error fetching bounties:", err);
      }
    };

    fetchBounties();
  }, []);

  return (
    <div className="bg-gray-800 text-white min-h-screen p-6">
      {loading ? (
        <div className="bg-gray-800 w-screen h-screen flex items-center justify-center">
          Loading...
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
            Bounties
          </h1>
          {bounties.length === 0 ? (
            <div className="bg-gray-800 w-screen h-screen flex items-center justify-center">
              No Bounties Found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {bounties.map((elem, index) => (
                <BountyCard elem={elem} key={index} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Bounty;
