import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const removeBounty = async (userId: string) => {
  try {
    const response = await axios.delete(`${AXIOS_URL}updatePassword/${userId}`);
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "An error occurred while removing bounty"
      );
    } else {
      throw new Error("An error occurred while removing bounty");
    }
  }
};
export default removeBounty;
