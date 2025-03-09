import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const updatePassword = async (
  userId: string,
  newPassword: string,
  role: string
) => {
  try {
    const response = await axios.put(`${AXIOS_URL}updatePassword/${userId}`, {
      newPassword,
      role,
    });
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while updating user's password."
      );
    } else {
      throw new Error("An error occurred while updating user's password.");
    }
  }
};
export default updatePassword;
