import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const verifyRegistration = async (registrationId: string, role: string) => {
  try {
    const response = await axios.post(
      `${AXIOS_URL}/registrations/verify/${registrationId}`,
      {
        role,
      }
    );
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while verifying the registration"
      );
    } else {
      throw new Error("An error occurred while verifying the registration");
    }
  }
};
export default verifyRegistration;
