import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sendNotification from "../../utils/sendNotification";

const Notification = () => {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState<
    "everyone" | "teacher" | "student"
  >("everyone");
  const [loading, setLoading] = useState(false);

  const handleSendNotification = async () => {
    if (!message) {
      toast.error("Message cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await sendNotification(message, recipient);
      toast.success(response.data.message || "Notification sent successfully!");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send notification.");
      console.error("Error while sending notification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-800 p-4 sm:p-6 md:p-8 h-screen">
      <div className="flex-1 w-full md:w-3/4 lg:w-1/2 xl:w-1/3 bg-gray-900 p-6 sm:p-8 rounded-lg shadow-xl mb-8 max-h-1/2">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-8 text-center text-yellow-400">
          Notifications
        </h1>

        <div className="mb-6">
          <textarea
            value={message}
            rows={8}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your notification here..."
            className="w-full border-2 border-yellow-300 rounded-lg px-4 py-3 text-yellow-300 bg-gray-800 outline-none placeholder:text-gray-400 resize-none focus:ring-2 focus:ring-yellow-400 transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="block text-yellow-400 text-lg mb-2">
            Select Recipient
          </label>
          <select
            value={recipient}
            onChange={(e) =>
              setRecipient(e.target.value as "everyone" | "teacher" | "student")
            }
            className="w-full border-2 border-yellow-300 rounded-lg px-4 py-3 text-yellow-300 bg-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          >
            <option value="everyone">Everyone</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="text-center">
          <button
            onClick={handleSendNotification}
            className={`bg-yellow-400 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-yellow-500 transition-all focus:ring-2 focus:ring-yellow-400 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default Notification;
