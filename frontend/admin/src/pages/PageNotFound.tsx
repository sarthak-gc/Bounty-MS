import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center p-8  rounded-lg shadow-xl">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-white mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <button
          onClick={() => {
            navigate("/users");
          }}
          className="px-6 py-2 text-white rounded-lg cursor-pointer "
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
