import { ChangeEvent, FormEvent, useState } from "react";
import { register } from "../../utils/register";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      role: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (credentials.role === "teacher" || credentials.role === "student") {
      try {
        const response = await register(credentials);
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 1200,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log(response);
        navigate(`/login`);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred during registration.";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1200,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      alert("Please select a role");
    }
  };

  return (
    <div className="bg-black w-screen h-screen flex justify-center items-center px-6 sm:px-12">
      <form
        className="p-8 rounded-lg w-full md:w-2/3 lg:w-2/5 shadow-lg border border-gray-700"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Register
        </h2>

        <div className="mb-6">
          <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={credentials.name}
            onChange={handleInputChange}
            className="outline-none w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleInputChange}
            className="outline-none w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-sm text-gray-400 mb-2"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={credentials.username}
            onChange={handleInputChange}
            className="outline-none w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm text-gray-400 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleInputChange}
            className="outline-none w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="role" className="block text-sm text-gray-400 mb-2">
            Role
          </label>
          <select
            name="role"
            value={credentials.role}
            onChange={handleSelectChange}
            className="outline-none w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
          >
            <option value="">Select Role</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 text-white bg-yellow-400 w-full border-2 border-gray-700 cursor-pointer hover:bg-yellow-300 rounded-lg shadow-md text-2xl transition duration-300 ease-in-out transform hover:scale-105"
          >
            Register
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
