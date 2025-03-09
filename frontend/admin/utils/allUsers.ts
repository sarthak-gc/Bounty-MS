import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const allUser = async () => {
  try {
    const response = await axios.get(`${AXIOS_URL}/users/`);
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "An error occurred while fetching"
      );
    } else {
      throw new Error("An error occurred while fetching");
    }
  }
};

export default allUser;
