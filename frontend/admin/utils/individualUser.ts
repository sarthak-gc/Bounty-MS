import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const getUser = async (userId: string, role: string) => {
  try {
    const response = await axios.get(`${AXIOS_URL}/user/${role}/${userId}`);

    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "An error occurred while getting user."
      );
    } else {
      throw new Error("An error occurred while getting user.");
    }
  }
};
export default getUser;
