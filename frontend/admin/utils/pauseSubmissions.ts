import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const pauseSubmissions = async (bountyId: string) => {
  try {
    const response = await axios.put(
      `${AXIOS_URL}/submissions/pause/${bountyId}`
    );
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while pausing submissions."
      );
    } else {
      throw new Error("An error occurred while pausing submissions.");
    }
  }
};
export default pauseSubmissions;
