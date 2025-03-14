import { useEffect, useState } from "react";
import User from "../../utils/allUsers";

import UserSideBar from "../components/UserSideBar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import updatePassword from "../../utils/updatePassword";

type UserT = {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: string;
};

const UpdatePassword = () => {
  const [users, setUsers] = useState<UserT[]>([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState<UserT[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [userToResetPassword, setUserToResetPassword] = useState<string | null>(
    null
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await User();
        const data = response.data.data;
        const usersWithoutDuplicates = [
          ...data.students.filter(
            (student: UserT) =>
              !data.teachers.some(
                (teacher: UserT) => teacher.name === student.name
              )
          ),
          ...data.teachers,
        ];
        setUsers(usersWithoutDuplicates);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users
        .filter((user) => selectedRole === "all" || user.role === selectedRole)
        .filter(
          (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [users, selectedRole, searchQuery]);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    if (userToResetPassword) {
      try {
        const user = users.find((user) => user._id === userToResetPassword);
        if (!user) {
          toast.error("User not found.");
          return;
        }

        const response = await updatePassword(
          userToResetPassword,
          newPassword,
          user.role
        );
        console.log(response);
        toast.success("Password reset successfully!");
        setNewPassword("");
        setConfirmPassword("");
        setUserToResetPassword(null);
      } catch (error) {
        toast.error("Error resetting password. Please try again later.");
        console.error("Error resetting password:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-800">
      <UserSideBar setSelectedRole={setSelectedRole} />
      <div className="flex-1 p-8">
        <div className="relative w-full flex justify-end ">
          <input
            type="search"
            placeholder="Search User..."
            className="w-full lg:w-1/4 border-2 border-yellow-300 rounded-lg px-4 py-3 text-yellow-300 bg-gray-800 outline-none placeholder:text-gray-400"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-yellow-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
        </div>

        <h1 className="text-4xl font-semibold mb-8 text-center text-yellow-400">
          {selectedRole === "all"
            ? "All Users"
            : selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
        </h1>

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
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-gray-200">
                  <td className="px-6 py-4 border-r border-gray-200">
                    {user.name[0].toUpperCase() + user.name.slice(1)}
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200">
                    {user.role[0].toUpperCase() + user.role.slice(1)}
                  </td>
                  <td className="px-6 py-4 text-center gap-3 justify-around flex">
                    <Link
                      to={`/${user.role}/${user._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        setUserToResetPassword(user._id);
                      }}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      Update Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {userToResetPassword && (
          <div className="modal fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">
                Update Password for{" "}
                {users.find((user) => user._id === userToResetPassword)?.name}
              </h3>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleResetPassword}
                  className={`bg-yellow-500 text-white py-2 px-4 rounded ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Confirm Reset"}
                </button>
                <button
                  onClick={() => setUserToResetPassword(null)}
                  className="text-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
