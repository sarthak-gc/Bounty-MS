import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../utils/login";

const Settings = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="lg:block lg:w-64 h-20 flex items-center justify-center bg-gray-900 text-white p-5 space-y-4 lg:h-screen lg:border-r border-r-gray-400">
      <div className="lg:space-y-4 flex lg:block w-full  items-center justify-center gap-4">
        <Link to="/update-user-password">
          <p>Update User&apos;s Password</p>
        </Link>
        <div
          onClick={() => {
            handleLogout();
          }}
          className="cursor-pointer"
        >
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
