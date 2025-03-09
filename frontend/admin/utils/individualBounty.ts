import axios, { AxiosError } from "axios";
const AXIOS_URL = "http://localhost:3000/admin";

const getBounty = async (bountyId: string) => {
  try {
    const response = await axios.get(`${AXIOS_URL}/bounties/${bountyId}`);
    console.log(response.data.data);
    return response;
  } catch (err) {
    console.log(err);
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "An error occurred while getting bounty."
      );
    } else {
      throw new Error("An error occurred while getting bounty.");
    }
  }
};
export default getBounty;
