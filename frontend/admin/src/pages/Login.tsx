import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/login.ts";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      navigate("/users");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during login.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="bg-black w-screen h-screen flex justify-center items-center px-6 sm:px-12">
      <form
        className="p-8 rounded-lg w-full md:w-2/3 lg:w-2/5 shadow-lg border border-gray-700"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Login
        </h2>

        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-sm text-gray-400 mb-2"
          >
            Username
          </label>
          <input
            className="outline-none w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
            onChange={handleChange}
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
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
            className="outline-none w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
            onChange={handleChange}
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
          />
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
