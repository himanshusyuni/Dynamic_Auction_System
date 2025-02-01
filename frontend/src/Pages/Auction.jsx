import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Redirect from "../Components/Redirect";
import Footer from "../Components/Footer";

const ItemDetailsPage = () => {
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [auctionEndTime, setAuctionEndTime] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/auction/${id}`
        );
        const fetchedItem = response.data.item;
        const highestBidderEmail = response.data.user.email;
        console.log(highestBidderEmail);
        setItem({ ...fetchedItem, highestBidderEmail });

        const createdAt = new Date(fetchedItem.createdAt);
        const auctionDurationInHours = fetchedItem.auctionTime;
        const auctionEndDate = new Date(
          createdAt.getTime() + auctionDurationInHours * 60 * 60 * 1000
        );
        setAuctionEndTime(auctionEndDate.toLocaleString());
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    fetchItemData();
  }, [id]);

  useEffect(() => {
    if (item && item.itemPic && item.itemPic.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === item.itemPic.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [item]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const parsedBidAmount = Number(bidAmount);

    if (parsedBidAmount <= item.currPrice) {
      console.log("Bid should be higher than current price");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/auction/${id}`,
        { currPrice: parsedBidAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        console.log("Bid placed successfully");
        window.location.reload();
        return;
      }
    } catch (err) {
      console.error("Problem in placing bid", err);
    }
  };

  if (!item) {
    return <div>Loading...</div>;
  }
  if (!token) {
    return <Redirect />;
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between bg-white p-4 shadow-md">
          <div className="text-xl font-bold text-blue-600">Auction System</div>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
          >
            Go Back
          </button>
        </div>

        <div className="container mx-auto p-8">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0">
            <div className="flex-1">
              <img
                src={
                  item.itemPic[currentImageIndex] ||
                  "https://cdn.shopify.com/s/files/1/0625/3818/6989/files/1_165eca79-1b17-42c1-b328-3d64a1441f0c.jpg?v=1676615487"
                }
                alt={item.itemName}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>

            <div className="flex-1 md:ml-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-gray-800">
                  {item.itemName}
                </h2>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Auction Ends:</p>
                  <p className="text-sm text-gray-500">{auctionEndTime}</p>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-gray-600">Seller: {item.sellerEmail}</p>
                <p className="text-xl font-bold text-blue-600 mt-2">
                  ${item.currPrice}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-800">
                  Highest Bidder:
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {item.highestBidderEmail}
                </p>
              </div>

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
                <p className="text-sm text-gray-600 mt-2">
                  Place a bid higher than the current price to participate.
                </p>
              </form>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex space-x-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Description:
              </h3>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ItemDetailsPage;
