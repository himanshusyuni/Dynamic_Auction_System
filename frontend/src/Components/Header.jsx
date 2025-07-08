import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaUser, FaHome } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-3 flex items-center justify-between">
      {/* Left: BidHub Logo */}
      <div
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        BidHub
      </div>

      {/* Right: Navigation Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-white bg-gray-700 px-4 py-2 rounded hover:bg-gray-800"
        >
          <FaHome />
          Home
        </button>

        <button
          onClick={() => navigate("/auction/create")}
          className="flex items-center gap-2 text-sm text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          <FaPlus />
          Create Auction
        </button>
      </div>
    </header>
  );
};

export default Header;
