import { useState } from "react";

type UserSideBarProps = {
  setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
};

const UserSideBar: React.FC<UserSideBarProps> = ({ setSelectedRole }) => {
  const [selectedRole, setSelectedRoleState] = useState<string>("all");

  const handleClick = (role: string) => {
    setSelectedRoleState(role);
    setSelectedRole(role);
  };

  return (
    <div className="lg:block lg:w-64 h-20 flex items-center justify-center bg-gray-900 text-white p-5 space-y-4 lg:h-screen lg:border-r border-r-gray-400">
      <div className="lg:space-y-4 flex lg:block w-full  items-center justify-center gap-4">
        <div
          className={`cursor-pointer ${
            selectedRole === "all" ? "text-yellow-400" : "hover:text-yellow-400"
          }`}
          onClick={() => handleClick("all")}
        >
          <p>All Users</p>
        </div>
        <div
          className={`cursor-pointer ${
            selectedRole === "teacher"
              ? "text-yellow-400"
              : "hover:text-yellow-400"
          }`}
          onClick={() => handleClick("teacher")}
        >
          <p>Teachers</p>
        </div>
        <div
          className={`cursor-pointer ${
            selectedRole === "student"
              ? "text-yellow-400"
              : "hover:text-yellow-400"
          }`}
          onClick={() => handleClick("student")}
        >
          <p>Students</p>
        </div>
      </div>
    </div>
  );
};

export default UserSideBar;
