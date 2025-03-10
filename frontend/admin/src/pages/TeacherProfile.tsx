import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getUser from "../../utils/individualUser";
import getTeacherBounties from "../../utils/teacherBounties";
import getBalance from "../../utils/getBalance";
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

type TeacherProfileT = {
  _id: string;
  name: string;
  email: string;
  bounties: BountyT[];
  role: string;
};

const TeacherProfile = () => {
  const [teacherDetails, setTeacherDetails] = useState<TeacherProfileT | null>(
    null
  );
  const [teacherBounties, setTeacherBounties] = useState<BountyT[]>([]);
  const [filteredTeacherBounties, setFilteredTeacherBounties] =
    useState<BountyT[]>(teacherBounties);
  const [selectedStatus, setSelectedStatus] = useState<BountyStatus | string>(
    ""
  );
  const [balance, setBalance] = useState<number>(0);
  const { teacherId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedStatus.trim())
      setFilteredTeacherBounties(
        teacherBounties.filter((bounty) => {
          return bounty.status === selectedStatus;
        })
      );
    else {
      setFilteredTeacherBounties(teacherBounties);
    }
  }, [selectedStatus, teacherBounties]);
  useEffect(() => {
    const fetchTeacherDetails = async () => {
      if (!teacherId) {
        navigate(-1);
        return;
      }

      try {
        const response = await getUser(teacherId, "teacher");
        const data = response.data.data;
        setTeacherDetails(data.user);
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    };

    const fetchTeacherBounties = async () => {
      if (!teacherId) return;
      try {
        const response = await getTeacherBounties(teacherId);
        const data = response.data.data;
        setTeacherBounties(data.bounties);
      } catch (error) {
        console.error("Error fetching teacher's bounties:", error);
      }
    };

    const getTeacherBalance = async () => {
      if (!teacherId) return;
      try {
        const response = await getBalance(teacherId);
        const data = response.data.data;
        setBalance(data.balance);
      } catch (error) {
        console.error("Error fetching teacher's balance:", error);
      }
    };

    getTeacherBalance();
    fetchTeacherDetails();
    fetchTeacherBounties();
  }, [teacherId, navigate]);

  if (!teacherDetails) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  const { name, email, role } = teacherDetails;

  const totalBountiesCreated = teacherBounties.length;
  const totalBountiesOpen = teacherBounties.filter(
    (bounty) => bounty.status === BountyStatus.Open
  ).length;
  const totalBountiesPaid = teacherBounties.filter(
    (bounty) => bounty.status === BountyStatus.Paid
  ).length;
  const totalBountiesExpired = teacherBounties.filter(
    (bounty) => bounty.status === BountyStatus.Expired
  ).length;

  const totalBountyAmountPaid = teacherBounties
    .filter((bounty) => bounty.status === BountyStatus.Paid)
    .reduce((sum, bounty) => sum + bounty.price, 0);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-4xl w-full mx-auto p-6 bg-gray-800 shadow-lg rounded-lg h-[95vh] overflow-hidden">
        <div className="flex flex-col md:flex-row items-center mb-6">
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-4xl">
              <span>{name[0].toUpperCase()}</span>
            </div>
          </div>
          <div className="ml-6 text-center md:text-left">
            <h1 className="text-3xl font-semibold text-yellow-400">{name}</h1>
            <p className="text-sm text-gray-300">{role}</p>
            <p className="text-sm text-gray-300">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-gray-700  rounded-md text-center">
            <h3 className="text-lg font-semibold text-yellow-100">
              Total Balance
            </h3>
            <p className="text-xl text-yellow-300">${balance}</p>
          </div>

          <div className="p-4 bg-gray-700  rounded-md text-center">
            <h3 className="text-lg font-semibold text-yellow-100">
              Total Bounties
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-yellow-300">
                <strong>Created:</strong> {totalBountiesCreated}
              </p>
              <p className="text-sm text-yellow-300">
                <strong>Open:</strong> {totalBountiesOpen}
              </p>
              <p className="text-sm text-yellow-300">
                <strong>Paid:</strong> {totalBountiesPaid}
              </p>
              <p className="text-sm text-yellow-300">
                <strong>Expired:</strong> {totalBountiesExpired}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600 p-4 rounded-md text-center mb-6">
          <h3 className="text-lg font-semibold text-yellow-100">
            Total Bounty Amount Paid
          </h3>
          <p className="text-xl text-yellow-300">${totalBountyAmountPaid}</p>
        </div>

        <div className="mb-6 flex justify-between border border-b-2 border-b-yellow-400">
          <h2 className="text-xl font-semibold text-yellow-100 mb-4">
            Bounties Created
          </h2>
          <div>
            <label
              className="text-xl font-semibold text-yellow-100 mb-4"
              htmlFor="status-filter"
            >
              {" "}
              Filter Bounty category
            </label>
            <select
              name="status-filter"
              id="status-filter"
              className=" p-2 rounded-md mb-4 bg-gray-800 text-yellow-400"
              onChange={(e) => {
                const { value } = e.target;
                setSelectedStatus(value || "");
              }}
            >
              <option value="">All</option>
              <option value={BountyStatus.Expired}>Expired</option>
              <option value={BountyStatus.Open}>Open</option>
              <option value={BountyStatus.Paused}>Paused</option>
              <option value={BountyStatus.Paid}>Paid</option>
            </select>
          </div>
        </div>

        <div className=" h-[50vh] overflow-scroll p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredTeacherBounties.map((bounty, index) => (
              <BountyCard key={index} elem={bounty} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
