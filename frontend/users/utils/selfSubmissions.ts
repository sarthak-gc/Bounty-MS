import axios, { AxiosError } from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
const AXIOS_URL = "http://localhost:3000";
interface decodedValueI extends JwtPayload {
  id: string;
  role: string;
}

const selfSubmissions = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const decodedToken = jwtDecode(token) as decodedValueI;

    // studentRoutes.get("/submissions/", getAllSubmissions);

    const response = await axios.get(
      `${AXIOS_URL}/${decodedToken.role}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while retriving submission from the server."
      );
    } else {
      throw new Error(
        "An error occurred while retriving submission from the server."
      );
    }
  }
};
export default selfSubmissions;
