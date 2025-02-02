import React, { useState } from "react";

const BidForm = ({ currPrice, handleBidSubmit }) => {
  const [bidAmount, setBidAmount] = useState("");

  return (
    <form onSubmit={(e) => handleBidSubmit(e, bidAmount)} className="mt-6">
      <div className="flex space-x-2 items-center">
        <label
          htmlFor="bidAmount"
          className="text-lg font-medium text-gray-700"
        >
          Your Bid:
        </label>
        <input
          type="number"
          id="bidAmount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="w-32 px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Bid"
          required
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Place Bid
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Place a bid higher than the current price to participate.
      </p>
    </form>
  );
};

export default BidForm;
