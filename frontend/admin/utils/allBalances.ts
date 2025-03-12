import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const getAllBalance = async () => {
  try {
    const response = await axios.get(`${AXIOS_URL}/balance`);

    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while retriving bounties from the server."
      );
    } else {
      throw new Error(
        "An error occurred while retriving bounties from the server."
      );
    }
  }
};
export default getAllBalance;
