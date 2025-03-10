import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import getUser from "../../utils/individualUser";
import getStudentSubmissions from "../../utils/studentSubmissions";
import getBalance from "../../utils/getBalance";

enum SubmissionStatus {
  Rejected = "Rejected",
  Approved = "Approved",
  Submitted = "Submitted",
  Cancelled = "Cancelled",
}

type SubmissionT = {
  _id: string;
  bountyId: {
    _id: string;
    question: string;
    price: number;
  };
  submission: string;
  status: SubmissionStatus;
  answer: string;
  accepetedBy: string | null;
  rejectedBy: string | null;
};

type StudentDetailsT = {
  _id: string;
  name: string;
  email: string;
  role: string;
  submissions: SubmissionT[];
};

const StudentProfile = () => {
  const [studentDetails, setStudentDetails] = useState<StudentDetailsT | null>(
    null
  );
  const [studentSubmissions, setStudentSubmissions] = useState<SubmissionT[]>(
    []
  );
  const [filteredSubmissions, setFilteredSubmissions] = useState<SubmissionT[]>(
    []
  );
  const [selectedStatus, setSelectedStatus] = useState<
    SubmissionStatus | string
  >("");
  const [balance, setBalance] = useState<number>(0);
  const { studentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!studentId) {
        navigate(-1);
        return;
      }
      try {
        const response = await getUser(studentId, "student");
        const data = response.data.data;
        setStudentDetails(data.user);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    const fetchStudentSubmissions = async () => {
      if (!studentId) return;
      try {
        const response = await getStudentSubmissions(studentId);
        const data = response.data.data;
        setStudentSubmissions(data.submissions);
      } catch (error) {
        console.error("Error fetching student submissions:", error);
      }
    };

    const fetchBalance = async () => {
      if (!studentId) return;
      try {
        const response = await getBalance(studentId);
        const data = response.data.data;
        setBalance(data.balance);
      } catch (error) {
        console.error("Error fetching student balance:", error);
      }
    };

    fetchStudentDetails();
    fetchStudentSubmissions();
    fetchBalance();
  }, [studentId, navigate]);

  useEffect(() => {
    if (selectedStatus.trim()) {
      setFilteredSubmissions(
        studentSubmissions.filter(
          (submission) => submission.status === selectedStatus
        )
      );
    } else {
      setFilteredSubmissions(studentSubmissions);
    }
  }, [selectedStatus, studentSubmissions]);

  if (!studentDetails) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  const { name, email, role } = studentDetails;

  const totalSubmissions = studentSubmissions.length;
  const totalAcceptedSubmissions = studentSubmissions.filter(
    (submission) => submission.status === SubmissionStatus.Approved
  ).length;
  const totalRejectedSubmissions = studentSubmissions.filter(
    (submission) => submission.status === SubmissionStatus.Rejected
  ).length;
  const totalPendingSubmissions = studentSubmissions.filter(
    (submission) => submission.status === SubmissionStatus.Submitted
  ).length;

  const statusColorMap: { [key in SubmissionStatus]: string } = {
    [SubmissionStatus.Approved]: "text-green-400",
    [SubmissionStatus.Rejected]: "text-red-400",
    [SubmissionStatus.Submitted]: "text-yellow-400",
    [SubmissionStatus.Cancelled]: "text-red-800",
  };

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
          <div className="p-4 bg-gray-700  rounded-md flex flex-col">
            <h3 className="text-lg font-semibold text-yellow-100 text-center">
              Current Balance
            </h3>
            <p className="text-4xl text-yellow-300  w-full  items-center justify-center flex h-full">
              ${balance}
            </p>
          </div>

          <div className="p-4 bg-gray-700 rounded-md  px-12">
            <h3 className="text-lg font-semibold text-yellow-100 mb-4 text-center">
              Submissions Status
            </h3>

            <div className="text-sm text-yellow-100">
              <strong>Total Submissions:</strong> {totalSubmissions}
            </div>
            <div className="text-sm text-green-400">
              <strong>Accepted :</strong> {totalAcceptedSubmissions}
            </div>
            <div className="text-sm text-yellow-300">
              <strong>Pending :</strong> {totalPendingSubmissions}
            </div>
            <div className="text-sm text-red-400">
              <strong>Rejected :</strong> {totalRejectedSubmissions}
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between  border-b-2 border-b-yellow-400">
          <h2 className="text-xl font-semibold text-yellow-100 mb-4">
            Bounties Submitted
          </h2>
          <div>
            <label
              className="text-xl font-semibold text-yellow-100 mb-4"
              htmlFor="status-filter"
            >
              Submission Status
            </label>
            <select
              name="status-filter"
              id="status-filter"
              className="p-2 rounded-md mb-4 text-center  bg-gray-800 text-yellow-400 border border-gray-500 ml-4"
              onChange={(e) => {
                const { value } = e.target;
                setSelectedStatus(value || "");
              }}
            >
              <option value="">All</option>
              <option value={SubmissionStatus.Approved}>Accepted</option>
              <option value={SubmissionStatus.Rejected}>Rejected</option>
              <option value={SubmissionStatus.Submitted}>Pending</option>
            </select>
          </div>
        </div>

        <div className="h-[50vh] overflow-scroll p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredSubmissions.map((submission) => {
              return (
                <div
                  key={submission._id}
                  className="rounded-lg overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="p-6 bg-black h-fit flex flex-col justify-between gap-3">
                    <h2 className="text-2xl font-semibold text-yellow-300 overflow-hidden">
                      {submission.bountyId.question}
                    </h2>

                    <p className="text-sm text-gray-300 ">
                      Amount: ${submission.bountyId.price}
                    </p>

                    <p
                      className={`font-semibold text-lg  rounded-md ${
                        statusColorMap[submission.status]
                      } `}
                    >
                      {submission.status}
                    </p>

                    <Link
                      to={`/bounties/${submission._id}`}
                      className="text-yellow-500 mt-4 inline-block bg-gray-800 p-2 rounded-md text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
