import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import submitAnswer from "../../utils/submitAnswer";

const SubmitAnswer = () => {
  const { bountyId } = useParams();
  const navigate = useNavigate();
  // const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // const selectedFile = e.target.files ? e.target.files[0] : null;
  // setFile(selectedFile);
  // };

  // Handle description text change
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if a file has been selected
    // if (!file) {
    //   toast.error("Please upload a file.", {
    //     position: "top-right",
    //     autoClose: 1200,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   });
    //   return;
    // }

    setLoading(true);

    if (!bountyId) {
      return;
    }
    try {
      // const formData = new FormData();
      // formData.append("file", file); // Append the uploaded file
      // formData.append("description", description); // Append the description (if any)

      // Submit the answer using the utility function
      // const response = await submitAnswer(bountyId!, formData); // Sending bountyId and form data

      const response = await submitAnswer(bountyId);

      console.log(response.data);
      toast.success("Answer submitted successfully!", {
        position: "top-right",
        autoClose: 1200,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to the student's dashboard or another page after submission
      navigate(`/student-dashboard`);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred while adding bounty.",
        {
          position: "top-right",
          autoClose: 1200,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">
        Submit Your Answer
      </h1>

      <form
        className="bg-gray-700 p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="file" className="block text-sm text-gray-400 mb-2">
            Upload Your Answer File
          </label>
          <input
            type="file"
            id="file"
            // onChange={handleFileChange}
            className="w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm text-gray-400 mb-2"
          >
            Optional Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full p-4 bg-gray-900 text-white rounded-md border border-gray-700"
            placeholder="Add an optional description for your answer"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className={`px-6 py-3 text-white w-full rounded-lg shadow-md text-2xl transition duration-300 ease-in-out transform hover:scale-105 ${
            loading
              ? "bg-gray-300 opacity-50 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-300 cursor-pointer"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Answer"}
        </button>
      </form>
    </div>
  );
};

export default SubmitAnswer;
