import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const allRegistrations = async () => {
  try {
    const response = await axios.get(`${AXIOS_URL}/registrations`);
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while fetching registrations"
      );
    } else {
      throw new Error("An error occurred while fetching registrations");
    }
  }
};
export default allRegistrations;
