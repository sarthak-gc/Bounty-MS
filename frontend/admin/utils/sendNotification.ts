import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const sendNotification = async (
  message: string,
  recipient: "teacher" | "student" | "everyone" = "everyone"
) => {
  try {
    const response = await axios.post(`${AXIOS_URL}/sendNotifications`, {
      message,
      recipient,
    });
    return response;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message ||
          "An error occurred while sending notifications."
      );
    } else {
      throw new Error("An error occurred while sending notifications.");
    }
  }
};
export default sendNotification;
