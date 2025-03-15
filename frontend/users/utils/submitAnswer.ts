import axios, { AxiosError } from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
const AXIOS_URL = "http://localhost:3000";

interface decodedValueI extends JwtPayload {
  id: string;
  role: string;
}
const submitAnswer = async (bountyId: string) => {
  try {
    if (!bountyId) throw new Error("BountyId is required");

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const decodedToken = jwtDecode(token) as decodedValueI;

    const response = await axios.post(
      `${AXIOS_URL}/${decodedToken.role}/submit/${bountyId}`,
      {
        answer: " testing", // will have to replace this with file
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while retrieving submissions."
      );
    } else {
      throw new Error("An  error occurred while retrieving submissions.");
    }
  }
};

export default submitAnswer;
