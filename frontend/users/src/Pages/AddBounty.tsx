import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

import addBounty from "../../utils/addBounty";
import { useNavigate } from "react-router-dom";

const AddBounty = () => {
  const navigate = useNavigate();
  const [bountyData, setBountyData] = useState({
    bountyQuestion: "",
    price: 0,
    timeInMinutes: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    setBountyData((prevBountyData) => ({
      ...prevBountyData,
      [id]: id === "bountyQuestion" ? value : value.trim(),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { bountyQuestion, price, timeInMinutes } = bountyData;

    if (typeof bountyQuestion !== "string" || bountyQuestion.trim() === "") {
      toast.error("Question must be a non-empty string.", {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (price <= 0) {
      toast.error("Price must be a positive number.", {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (timeInMinutes <= 0) {
      toast.error("Time must be a positive integer.", {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      await addBounty(bountyData);

      toast.success("Bounty added successfully!", {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setBountyData({
        bountyQuestion: "",
        price: 0,
        timeInMinutes: 0,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while adding bounty.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black w-screen h-screen flex flex-col justify-center items-center px-6 sm:px-12 ">
      <button
        onClick={() => navigate(-1)}
        className="text-white self-end mb-4 px-6 py-3 bg-yellow-500 rounded-lg shadow-md border-2 border-gray-700 hover:bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Go Back
      </button>
      <form
        className="p-8 rounded-lg w-full md:w-3/4 lg:w-2/3 xl:w-2/5 2xl:w-1/3 shadow-lg border border-gray-700 "
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Add Bounty
        </h2>

        <div className="mb-6">
          <label
            htmlFor="bountyQuestion"
            className="block text-sm text-gray-400 mb-2"
          >
            Question
          </label>
          <textarea
            className="outline-none w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 resize-none"
            onChange={handleChange}
            id="bountyQuestion"
            name="bountyQuestion"
            placeholder="Enter bounty question"
            rows={6}
            value={bountyData.bountyQuestion}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="price" className="block text-sm text-gray-400 mb-2">
            Reward Amount
          </label>
          <input
            className="outline-none w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
            onChange={handleChange}
            type="number"
            id="price"
            name="price"
            placeholder="Enter reward amount"
            value={bountyData.price || ""}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="timeInMinutes"
            className="block text-sm text-gray-400 mb-2"
          >
            Time Limit
          </label>
          <input
            className="outline-none w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
            onChange={handleChange}
            type="number"
            id="timeInMinutes"
            name="timeInMinutes"
            placeholder="Enter bounty time limit in minutes"
            value={bountyData.timeInMinutes || ""}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className={`px-6 py-3 text-white w-full border-2 border-gray-700 rounded-lg shadow-md text-2xl transition duration-300 ease-in-out transform hover:scale-105 ${
              loading
                ? "bg-gray-300 opacity-50 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-300 cursor-pointer"
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Bounty"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBounty;
