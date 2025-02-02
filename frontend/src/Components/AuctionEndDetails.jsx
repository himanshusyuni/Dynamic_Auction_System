import React from "react";

const AuctionEndDetails = ({ item, handlePayment, userEmail }) => (
  <div className="mt-6 text-red-500">
    <p>The auction for this item has ended.</p>
    <p className="font-bold text-black text-2xl">
      Winner: {item.highestBidderEmail}
    </p>
    {item.paymentStatus === "pending" &&
      userEmail === item.highestBidderEmail && (
        <button
          onClick={handlePayment}
          className="mt-4 w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Proceed to Payment
        </button>
      )}
  </div>
);

export default AuctionEndDetails;
