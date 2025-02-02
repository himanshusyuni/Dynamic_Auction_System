import React from "react";

const AuctionDetails = ({ item, auctionEndTime }) => (
  <div className="mt-2">
    <p className="text-gray-600">Seller: {item.sellerEmail}</p>
    <p className="text-xl font-bold text-blue-600 mt-2">${item.currPrice}</p>
    <div className="mt-4">
      <p className="text-lg font-semibold text-gray-800">Highest Bidder:</p>
      <p className="text-lg font-bold text-gray-800">
        {item.highestBidderEmail}
      </p>
    </div>
  </div>
);

export default AuctionDetails;
