import { Link } from "react-router-dom";

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
  const statusColorMap: { [key in BountyStatus]: string } = {
    [BountyStatus.Open]: "text-green-400",
    [BountyStatus.Paused]: "text-yellow-400",
    [BountyStatus.Paid]: "text-blue-400",
    [BountyStatus.Expired]: "text-red-400",
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

        <p
          className={`font-semibold text-lg mt-4 p-2 rounded-md ${
            statusColorMap[elem.status]
          } `}
        >
          {elem.status}
        </p>

        <div className="mt-2 text-sm text-gray-300">
          <strong>Submissions:</strong> {elem.submissions.length}
        </div>

        {elem.studentId && (
          <div className="mt-2 text-sm text-gray-300">
            <strong>Accepted Student Name:</strong> {elem.studentId.name}
          </div>
        )}
        {elem.teacherId && (
          <div className="mt-2 text-sm text-gray-300">
            <strong>Teacher Name:</strong> {elem.teacherId.name}
          </div>
        )}

        <Link
          to={`/bounties/${elem._id}`}
          className="text-yellow-500 mt-4 inline-block bg-gray-800 p-2 rounded-md text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BountyCard;
