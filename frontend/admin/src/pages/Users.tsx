import { useEffect, useState } from "react";

import User from "../../utils/allUsers";
import Confirmation from "../components/Confirmation";
import UserSideBar from "../components/UserSideBar";

type UserT = {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: string;
};
const Users = () => {
  const [users, setUsers] = useState<UserT[]>([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState<UserT[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await User();
        const data = response.data.data;
        console.log(data);
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
      users.filter(
        (user) => selectedRole === "all" || user.role === selectedRole
      )
    );
  }, [users, selectedRole]);

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setMessage("Are you sure you want to delete user?");
    setIsModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (userToDelete) {
      setFilteredUsers((users) => {
        return users.filter((user) => user._id !== userToDelete);
      });
      setUserToDelete(null);
      setIsModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    setIsModalOpen(false);
  };
  return (
    <div className="flex flex-col lg:flex-row bg-gray-800">
      <UserSideBar setSelectedRole={setSelectedRole} />
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-semibold mb-8 text-center text-yellow-400">
          {selectedRole === "all"
            ? "All Users"
            : selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
        </h1>

        <div className="overflow-x-auto h-screen">
          <table className="min-w-full  border border-gray-200 rounded-lg shadow-lg text-yellow-400">
            <thead>
              <tr className="bg-gray-800 text-left border-b border-gray-200">
                <th className="px-6 py-3  font-medium text-center w-1/5 border-r border-gray-200">
                  Name
                </th>
                <th className="px-6 py-3  font-medium text-center w-1/5 border-r border-gray-200">
                  Email
                </th>
                <th className="px-6 py-3  font-medium text-center w-1/5 border-r border-gray-200">
                  Role
                </th>
                <th className="px-6 py-3  font-medium text-center w-1/5 border-r border-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-gray-200  ">
                  <td className="px-6 py-4 border-r border-gray-200">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        handleDelete(user._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Confirmation
          isOpen={isModalOpen}
          message={message}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
};

export default Users;
