import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000";
interface credentialsI {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}
export const register = async (credentials: credentialsI) => {
  try {
    const response = await axios.post(
      `${AXIOS_URL}/${credentials.role}/register`,
      {
        name: credentials.name,
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
        role: credentials.role,
      }
    );
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "An error occurred during registration."
      );
    } else {
      throw new Error("An error occurred during registration.");
    }
  }
};

export const logout = async () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  localStorage.removeItem("token");
};
