import { useNavigate } from "react-router-dom";

const Redirect = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
        <p className="text-gray-600 mb-6">
          Please login to proceed. Click the button below to continue.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go to Login Page
        </button>
      </div>
    </div>
  );
};
export default Redirect;
