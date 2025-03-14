import { ChangeEvent, FormEvent, useState } from "react";
import { login } from "../../utils/login";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (credentials.role === "teacher" || credentials.role === "student") {
      e.preventDefault();
      try {
        const response = await login(credentials);
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 1200,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        const expireTime = new Date();
        expireTime.setTime(expireTime.getTime() + 24 * 60 * 60 * 1000);
        document.cookie = `token=${token}; expires=${expireTime.toUTCString()}; path=/; secure; SameSite=Lax`;
        navigate(`/${credentials.role}/dashboard`);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred during login.";

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

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      role: e.target.value,
    }));
  };

  return (
    <div className="bg-black w-screen h-screen flex justify-center items-center px-6 sm:px-12">
      <form
        className="p-8 rounded-lg w-full md:w-2/3 lg:w-2/5 shadow-lg border border-gray-700"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Login
        </h2>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
            Email
          </label>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={credentials.email}
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
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
