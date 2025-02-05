import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Redirect from "../Components/Redirect";
import Footer from "../Components/Footer";
import ItemImageSlider from "../Components/ItemImageSlider";
import AuctionDetails from "../Components/AuctionDetails";
import BidForm from "../Components/BidForm";
import AuctionEndDetails from "../Components/AuctionEndDetails";
import DescriptionSection from "../Components/DescriptionSection";
import TagsSection from "../Components/TagsSection";
const BASE_URL = "https://dynamic-auction-system.vercel.app/api";
const ItemDetailsPage = () => {
  const [item, setItem] = useState(null);
  const [auctionEndTime, setAuctionEndTime] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get(`${BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserEmail(response.data.user.email);
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
    };

    fetchUserData();

    // Fetch item data
    const fetchItemData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/auction/${id}`);
        const fetchedItem = response.data.item;
        const highestBidderEmail = response.data.user.email;
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
  }, [id, token]);

  const handleBidSubmit = async (e, bidAmount) => {
    e.preventDefault();
    const parsedBidAmount = Number(bidAmount);

    if (parsedBidAmount <= item.currPrice) {
      console.log("Bid should be higher than current price");
      return;
    }

    try {
      const response = await axios.patch(
        `${BASE_URL}/auction/${id}`,
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

  const handlePayment = () => {
    navigate("/pending");
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
              <ItemImageSlider itemPics={item.itemPic} />
            </div>
            <div className="flex-1 md:ml-8">
              {/* Corrected position of item name and auction time */}
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-gray-800">
                  {item.itemName}
                </h2>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Auction Ends:</p>
                  <p className="text-sm text-gray-500">{auctionEndTime}</p>
                </div>
              </div>

              <AuctionDetails item={item} auctionEndTime={auctionEndTime} />

              {/* Conditional rendering based on auction status */}
              {item.auctionStatus !== "live" ? (
                <AuctionEndDetails
                  item={item}
                  handlePayment={handlePayment}
                  userEmail={userEmail}
                />
              ) : (
                <BidForm
                  currPrice={item.currPrice}
                  handleBidSubmit={handleBidSubmit}
                />
              )}
            </div>
          </div>

          <DescriptionSection description={item.description} />
          <TagsSection tags={item.tags} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ItemDetailsPage;
