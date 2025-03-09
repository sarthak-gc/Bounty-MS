import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const rejectRegistration = async (registrationId: string, role: string) => {
  try {
    const response = await axios.post(
      `${AXIOS_URL}/registrations/reject/${registrationId}`,
      { role }
    );
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while rejecting registration"
      );
    } else {
      throw new Error("An error occurred while rejecting registration");
    }
  }
};
export default rejectRegistration;
