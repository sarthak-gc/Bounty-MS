import axios, { AxiosError } from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
const AXIOS_URL = "http://localhost:3000";
interface decodedValueI extends JwtPayload {
  id: string;
  role: string;
}

interface questionDetailsI {
  bountyQuestion: string;
  price: number;
  timeInMinutes: number;
}
const addBounty = async (questionDetails: questionDetailsI) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const decodedToken = jwtDecode(token) as decodedValueI;

    const response = await axios.post(
      `${AXIOS_URL}/${decodedToken.role}/bounty`,
      {
        bountyQuestion: questionDetails.bountyQuestion,
        price: questionDetails.price,
        timeInMinutes: questionDetails.timeInMinutes,
      },
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
          "An error occurred while creating bounties."
      );
    } else {
      throw new Error("An error occurred while creating bounties.");
    }
  }
};
export default addBounty;
