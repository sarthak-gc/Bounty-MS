import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const addTeacherBalance = async (userId: string, balance: number) => {
  try {
    const response = await axios.post(
      `${AXIOS_URL}/teacher-balance/:${userId}`,
      { balance }
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
export default addTeacherBalance;
