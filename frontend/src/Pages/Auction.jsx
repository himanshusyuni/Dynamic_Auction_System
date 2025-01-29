import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ItemDetailsPage = () => {
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [auctionEndTime, setAuctionEndTime] = useState(""); // To store auction end time
  const { id } = useParams(); // Get the item id from the URL params
  const navigate = useNavigate();

  // Fetching the item data based on ID from the backend API
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/auction/${id}`
        );
        const fetchedItem = response.data.item; // Assuming your backend sends the item details as the response
        setItem(fetchedItem);

        // Calculate the auction end time
        const createdAt = new Date(fetchedItem.createdAt);
        const auctionDurationInHours = fetchedItem.auctionTime;
        const auctionEndDate = new Date(
          createdAt.getTime() + auctionDurationInHours * 60 * 60 * 1000
        );
        setAuctionEndTime(auctionEndDate.toLocaleString()); // Display as a readable time string
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    fetchItemData();
  }, [id]); // Trigger the fetch whenever the id changes

  const handleBidSubmit = (e) => {
    e.preventDefault();
    // Logic for submitting bid goes here
    console.log("Bid placed:", bidAmount);
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 shadow-md">
        <div className="text-xl font-bold text-blue-600">Auction System</div>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
        >
          Go Back
        </button>
      </div>

      {/* Item Details Section */}
      <div className="container mx-auto p-8">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0">
          {/* Item Image */}
          <div className="flex-1">
            <img
              src={
                item.itemPic ||
                "https://cdn.shopify.com/s/files/1/0625/3818/6989/files/1_165eca79-1b17-42c1-b328-3d64a1441f0c.jpg?v=1676615487"
              }
              alt={item.itemName}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Item Info */}
          <div className="flex-1 md:ml-8">
            {/* Item Title & Auction End Time */}
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold text-gray-800">
                {item.itemName}
              </h2>
              <span className="text-sm text-gray-500">
                Auction Ends: {auctionEndTime}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-gray-600">Seller: {item.sellerEmail}</p>
              <p className="text-xl font-semibold text-blue-600 mt-2">
                Current Price: ${item.currPrice}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-gray-600">{item.description}</p>
            </div>

            {/* Tags */}
            <div className="mt-4">
              <span className="text-sm text-gray-700">Tags:</span>
              <div className="flex space-x-2 mt-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bid Section */}
            <form onSubmit={handleBidSubmit} className="mt-6">
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
