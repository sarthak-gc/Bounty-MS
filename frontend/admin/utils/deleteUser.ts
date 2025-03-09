import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const deleteUser = async (userId: string, role: string) => {
  try {
    const response = await axios.delete(`${AXIOS_URL}/users/${userId}`, {
      data: {
        role,
      },
    });
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while deleting the user."
      );
    } else {
      throw new Error("An error occurred while deleting the user.");
    }
  }
};
export default deleteUser;
