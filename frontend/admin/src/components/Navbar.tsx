import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black text-white shadow-md ">
      <div className="w-screen-xl mx-auto px-10 lg:px-20 py-4 flex justify-between items-center">
        <Link to="/users" className="text-xl font-semibold">
          Admin Panel
        </Link>

        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div className="hidden lg:flex space-x-6">
          {[
            "Users",
            "Bounties",
            "Registrations",
            "Balances",
            "Notify",
            "Settings",
          ].map((text) => (
            <NavLink
              to={`/${text.toLowerCase()}`}
              className={({ isActive }) =>
                `text-white px-4 py-2 rounded-md ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              {text}
            </NavLink>
          ))}
        </div>
      </div>

      <div className={`lg:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="space-y-4 px-6 py-4 bg-gray-500 flex flex-col gap-5 absolute right-0 w-1/3 z-30">
          {[
            "Users",
            "Bounties",
            "Registrations",
            "Balances",
            "Notify",
            "Settings",
          ].map((text) => (
            <NavLink
              onClick={() => {
                setIsOpen(false);
              }}
              key={text}
              to={`/${text.toLowerCase()}`}
              className={({ isActive }) =>
                `text-white px-4 py-2 rounded-md ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              {text}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
