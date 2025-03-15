import { useEffect, useState } from "react";
import allBounties from "../../utils/allBounties";
import { useNavigate } from "react-router-dom";

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
  teacherId: {
    _id: string;
    name: string;
  };
};

const StudentBounty = () => {
  const [bounties, setBounties] = useState<BountyT[]>([]);
  const [sortedBounties, setSortedBounties] = useState<BountyT[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await allBounties();

        const availableBounties = response.data.bounties.filter(
          (bounty: BountyT) =>
            bounty.status === BountyStatus.Open ||
            bounty.status === BountyStatus.Paused
        );
        setBounties(availableBounties);
        setSortedBounties(availableBounties);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bounties:", err);
      }
    };

    fetchBounties();
  }, []);

  const handleViewDetails = (bountyId: string) => {
    navigate(`/bounty/${bountyId}`);
  };

  const handleSelectionChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "price") {
      setSortedBounties((prev) => [...prev].sort((a, b) => a.price - b.price));
    } else if (selectedValue === "expiryDate") {
      setSortedBounties((prev) =>
        [...prev].sort(
          (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
        )
      );
    } else if (selectedValue === "status") {
      setSortedBounties((prev) =>
        [...prev].sort((a, b) => a.status.localeCompare(b.status))
      );
    } else if (selectedValue === "") {
      setSortedBounties(bounties);
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen p-6">
      {loading ? (
        <div className="bg-gray-800 w-screen h-screen flex items-center justify-center">
          Loading...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4 mb-4">
            <h1 className="text-4xl font-bold text-yellow-400 col-span-4 flex items-center justify-center">
              <span>Bounties Available</span>
            </h1>
          </div>

          <select onChange={handleSelectionChange} name="sorting" id="">
            <option value="">No sorting</option>
            <option value="expiryDate">Sort by Expiry Date</option>
            <option value="price">Sort by Price</option>
            <option value="status">Sort by Status</option>
          </select>

          {sortedBounties.length === 0 ? (
            <div className="bg-gray-800 w-screen h-screen flex items-center justify-center">
              No Available Bounties
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-8 md:grid-cols-2">
              {sortedBounties.map((bounty, index) => (
                <div key={index}>
                  <BountyCard elem={bounty} />
                  <div className="text-center mt-4">
                    <button
                      onClick={() => handleViewDetails(bounty._id)}
                      className="px-6 py-3 text-white bg-yellow-400 w-full rounded-lg shadow-md text-xl transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentBounty;

type BountyCardProps = {
  elem: BountyT;
};

const BountyCard = ({ elem }: BountyCardProps) => {
  const statusColorMap: { [key in BountyStatus]: string } = {
    [BountyStatus.Open]: "bg-green-400",
    [BountyStatus.Paused]: "bg-yellow-400",
    [BountyStatus.Paid]: "bg-blue-400",
    [BountyStatus.Expired]: "bg-red-400",
  };
  return (
    <div
      className={`bg-gray-700 ${
        statusColorMap[elem.status]
      }  text-white p-6 rounded-lg shadow-md border border-gray-600`}
    >
      <h3 className="text-xl font-semibold">{elem.question}</h3>
      <p className="mt-2 text-sm">
        <strong>Creator:</strong>{" "}
        {elem.teacherId.name[0].toUpperCase() + elem.teacherId.name.slice(1)}
      </p>

      <p className="mt-2 text-sm">
        <strong>Status:</strong> {elem.status}
      </p>
      <p className="mt-2 text-sm">
        <strong>Price:</strong> {elem.price}
      </p>
      <p className="text-sm  mt-2">
        <strong>Expiry:</strong> {new Date(elem.expiryDate).toLocaleString()}
      </p>
    </div>
  );
};
