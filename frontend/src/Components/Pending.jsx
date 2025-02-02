import React from "react";
import { useNavigate } from "react-router-dom";

const Pending = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/"); // Navigate to the empty path (root URL or homepage)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          I am working on this feature
        </h2>
        <p className="text-gray-600 mb-6">
          The feature you are trying to access is currently under development.
          Please check back soon!
        </p>
        <button
          onClick={handleNavigate}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Pending;
