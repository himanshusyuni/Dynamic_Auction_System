import React from "react";
import { FiUser, FiDollarSign, FiUserCheck } from "react-icons/fi";

const AuctionDetails = ({ sellerEmail, highestBidderEmail, price }) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-2">
    {/* Current Price */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <FiDollarSign className="w-7 h-7 text-green-600" />
        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="text-3xl font-bold text-green-700">₹{price}</p>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-200 my-4"></div>

    {/* Seller & Highest Bidder */}
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div className="flex items-center space-x-3">
        <FiUser className="w-6 h-6 text-blue-600" />
        <div>
          <p className="text-xs text-gray-500">Seller</p>
          <p className="text-base font-medium text-gray-800 break-all">
            {sellerEmail}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <FiUserCheck className="w-6 h-6 text-purple-600" />
        <div>
          <p className="text-xs text-gray-500">Highest Bidder</p>
          <p className="text-base font-semibold text-gray-800 break-all">
            {highestBidderEmail}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AuctionDetails;
