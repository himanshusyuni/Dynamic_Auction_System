import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Redirect from "../Components/Redirect";
import Footer from "../Components/Footer";
import AuctionDetails from "../Components/AuctionDetails";
import BidForm from "../Components/BidForm";
import AuctionEndDetails from "../Components/AuctionEndDetails";
import DescriptionSection from "../Components/DescriptionSection";
import TagsSection from "../Components/TagsSection";
import { io } from "socket.io-client";
import Header from "../Components/Header";
import ItemImageSlider from "../Components/ItemImageSlider";
import { message } from "antd";

const BASE_URL = import.meta.env.VITE_BackendURL;

const ItemDetailsPage = () => {
  const [item, setItem] = useState(null);
  const [auctionEndTime, setAuctionEndTime] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [userEmail, setUserEmail] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [highestBidderEmail, setHighestBidderEmail] = useState("");

  useEffect(() => {
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

        setCurrentPrice(fetchedItem.currPrice);
        setHighestBidderEmail(highestBidderEmail);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    fetchUserData();
    fetchItemData();

    const socketUrl = import.meta.env.VITE_SocketURL;
    const socket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected. Reason:", reason);
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`Reconnection attempt: ${attemptNumber}`);
    });

    socket.emit("joinAuction", id, () => {
      console.log(`Joined auction room for auction ID: ${id}`);
    });

    socket.on("bidUpdated", (data) => {
      setCurrentPrice(data.highestBid);
      setHighestBidderEmail(data.bidderEmail);
    });

    return () => socket.disconnect();
  }, [id, token]);

  const handleBidSubmit = async (e, bidAmount) => {
    e.preventDefault();
    const parsedBidAmount = Number(bidAmount);

    if (parsedBidAmount <= currentPrice) {
      message.error("Bid should be higher than current price");
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
        message.success("Bid placed successfully");
        console.log("Bid placed successfully");
      }
    } catch (err) {
      console.error("Problem placing bid", err);
    }
  };

  const handlePayment = () => navigate("/pending");

  if (!item) return <div>Loading...</div>;
  if (!token) return <Redirect />;

  return (
    <div className="bg-gray-50 min-h-screen pt-8">
      <Header />

      <main className="container mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Centered Image */}
          <div className="flex items-center justify-center bg-white shadow-md rounded-lg border-2 border-blue-400 p-4">
            <ItemImageSlider itemPics={item.itemPic} />
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  {item.itemName}
                </h2>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Auction Ends:</p>
                  <p className="text-sm font-semibold text-red-600">
                    {auctionEndTime}
                  </p>
                </div>
              </div>

              <AuctionDetails
                price={currentPrice}
                highestBidderEmail={highestBidderEmail}
                sellerEmail={item.sellerEmail}
              />
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              {item.auctionStatus !== "live" ? (
                <AuctionEndDetails
                  item={item}
                  handlePayment={handlePayment}
                  userEmail={userEmail}
                />
              ) : (
                <BidForm
                  currPrice={currentPrice}
                  highestBidderEmail={highestBidderEmail}
                  handleBidSubmit={handleBidSubmit}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <TagsSection tags={item.tags} />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <DescriptionSection description={item.description} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetailsPage;
