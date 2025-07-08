import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "../Components/ItemCard";
import axios from "axios";
import Footer from "../Components/Footer";
import { FaPlus, FaUser } from "react-icons/fa";

const HomePage = () => {
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [completedAuctions, setCompletedAuctions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLiveAuctions, setFilteredLiveAuctions] = useState([]);
  const [filteredCompletedAuctions, setFilteredCompletedAuctions] = useState(
    []
  );

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BackendURL;

  const liveAuctionsRef = useRef([]);
  const searchQueryRef = useRef("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/auction`);
        const auctions = response.data.AuctionList;

        const live = auctions.filter((a) => a.auctionStatus === "live");
        const completed = auctions.filter((a) => a.auctionStatus !== "live");

        setLiveAuctions(live);
        setCompletedAuctions(completed);
        setFilteredLiveAuctions(live);
        setFilteredCompletedAuctions(completed);

        liveAuctionsRef.current = live;
      } catch (err) {
        console.error("Error fetching auctions", err);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    searchQueryRef.current = searchQuery;

    const query = searchQuery.toLowerCase();

    const liveFiltered = liveAuctions.filter(
      (auction) =>
        auction.itemName.toLowerCase().includes(query) ||
        auction.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    const completedFiltered = completedAuctions.filter(
      (auction) =>
        auction.itemName.toLowerCase().includes(query) ||
        auction.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    setFilteredLiveAuctions(liveFiltered);
    setFilteredCompletedAuctions(completedFiltered);
  }, [searchQuery, liveAuctions, completedAuctions]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen pt-24">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div
            className="text-xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            BidHub
          </div>

          {/* Centered Search Bar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1/2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                className="px-4 py-2 border border-gray-300 rounded-lg w-full pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="absolute right-0 top-0 bottom-0 px-4 py-2 bg-blue-600 text-white rounded-r-lg">
                Search
              </button>
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/auction/create")}
              className="flex items-center gap-2 text-sm text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              <FaPlus />
              Create Auction
            </button>

            <button
              onClick={() => navigate("/user")}
              className="flex items-center gap-2 text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              <FaUser />
              Profile
            </button>
          </div>
        </div>

        {/* Live Auctions */}
        <div className="pl-8">
          <h2 className="text-2xl font-bold mb-4">Live Auctions</h2>
          <div className="flex overflow-x-auto space-x-4">
            {filteredLiveAuctions.length > 0 ? (
              filteredLiveAuctions.map((item) => (
                <div
                  key={item._id}
                  className="flex-none py-2 pl-2 w-64 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate(`/auction/${item._id}`)}
                >
                  <ItemCard item={item} />
                </div>
              ))
            ) : (
              <p>No live auctions match your search.</p>
            )}
          </div>
        </div>

        {/* Completed Auctions */}
        <div className="p-8 bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Completed Auctions</h2>
          <div className="flex overflow-x-auto space-x-4">
            {filteredCompletedAuctions.length > 0 ? (
              filteredCompletedAuctions.map((item) => (
                <div
                  key={item._id}
                  className="flex-none  py-2 w-64 pl-2 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate(`/auction/${item._id}`)}
                >
                  <ItemCard item={item} />
                </div>
              ))
            ) : (
              <p>No completed auctions match your search.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
