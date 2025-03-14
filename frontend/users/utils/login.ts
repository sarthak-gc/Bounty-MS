import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000";
interface credentialsI {
  email: string;
  password: string;
  role: string;
}
export const login = async (credentials: credentialsI) => {
  try {
    const response = await axios.post(
      `${AXIOS_URL}/${credentials.role}/login`,
      {
        email: credentials.email,
        password: credentials.password,
        role: credentials.role,
      }
    );
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "An error occurred during login."
      );
    } else {
      throw new Error("An error occurred during login.");
    }
  }
};

export const logout = async () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  localStorage.removeItem("token");
};
