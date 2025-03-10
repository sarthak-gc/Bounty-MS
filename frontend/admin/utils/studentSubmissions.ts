import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const getStudentSubmissions = async (userId: string) => {
  try {
    const response = await axios.get(`${AXIOS_URL}/submissions/${userId}`);
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while fetching teacher's bounties."
      );
    } else {
      throw new Error("An error occurred while fetching teacher's bounties.");
    }
  }
};
export default getStudentSubmissions;
