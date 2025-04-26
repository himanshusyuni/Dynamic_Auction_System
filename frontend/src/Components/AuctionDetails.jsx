import React from "react";

const AuctionDetails = ({ sellerEmail, highestBidderEmail, price }) => (
  <div className="mt-2">
    <p className="text-gray-600">Seller: {sellerEmail}</p>
    <p className="text-xl font-bold text-blue-600 mt-2">₹{price}</p>
    <div className="mt-4">
      <p className="text-lg font-semibold text-gray-800">Highest Bidder:</p>
      <p className="text-lg font-bold text-gray-800">{highestBidderEmail}</p>
    </div>
  </div>
);

export default AuctionDetails;
