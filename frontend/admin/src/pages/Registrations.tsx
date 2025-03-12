import { useEffect, useState } from "react";
import allRegistrations from "../../utils/allRegistrations";
import verifyRegistration from "../../utils/verifyRegistration";
import rejectRegistration from "../../utils/rejectRegistration";

type RegistrationT = {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: string;
};

const Registrations = () => {
  const [registrations, setRegistrations] = useState<RegistrationT[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleReject = async (userId: string, role: string) => {
    try {
      const response = await rejectRegistration(userId, role);
      const data = response.data.data;
      setRegistrations((prev) =>
        prev.filter((registration) => registration._id !== userId)
      );
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (userId: string, role: string) => {
    try {
      const response = await verifyRegistration(userId, role);
      const data = response.data.data;
      console.log(data);
      setRegistrations((prev) =>
        prev.filter((registration) => registration._id !== userId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await allRegistrations();
        const data = response.data.data;
        const usersWithoutDuplicates = [
          ...data.students.filter(
            (student: RegistrationT) =>
              !data.teachers.some(
                (teacher: RegistrationT) => teacher.name === student.name
              )
          ),
          ...data.teachers,
        ];
        setRegistrations(usersWithoutDuplicates);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter(
    (registration) =>
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row bg-gray-800">
      <div className="flex-1 p-8">
        {/* Search Bar */}
        <div className="relative w-full flex justify-end mb-8">
          <input
            type="search"
            placeholder="Search Registration..."
            className="w-full lg:w-1/4 border-2 border-yellow-300 rounded-lg px-4 py-3 text-yellow-300 bg-gray-800 outline-none placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-yellow-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-semibold mb-8 text-center text-yellow-400">
          Registrations
        </h1>

        {/* Table */}
        <div className="overflow-x-auto h-screen">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-lg text-yellow-400">
            <thead>
              <tr className="bg-gray-800 text-left border-b border-gray-200">
                <th className="px-6 py-3 font-medium text-center w-1/5 border-r border-gray-200">
                  Name
                </th>
                <th className="px-6 py-3 font-medium text-center w-1/5 border-r border-gray-200">
                  Email
                </th>
                <th className="px-6 py-3 font-medium text-center w-1/5 border-r border-gray-200">
                  Role
                </th>
                <th className="px-6 py-3 font-medium text-center w-1/5 border-r border-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((registration) => (
                <tr key={registration._id} className="border-b border-gray-200">
                  <td className="px-6 py-4 border-r border-gray-200">
                    {registration.name[0].toUpperCase() +
                      registration.name.slice(1)}
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200">
                    {registration.email}
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200">
                    {registration.role[0].toUpperCase() +
                      registration.role.slice(1)}
                  </td>
                  <td className="px-6 py-4 text-center gap-3 justify-around flex">
                    <button
                      onClick={() => {
                        handleReject(registration._id, registration.role);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        handleVerify(registration._id, registration.role);
                      }}
                      className="text-green-500 hover:text-green-700"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Registrations;
