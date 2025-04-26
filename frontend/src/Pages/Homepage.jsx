import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "../Components/ItemCard";
import axios from "axios";
import Footer from "../Components/Footer";

const HomePage = () => {
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [completedAuctions, setCompletedAuctions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLiveAuctions, setFilteredLiveAuctions] = useState([]);
  const [filteredCompletedAuctions, setFilteredCompletedAuctions] = useState(
    []
  );

  const navigate = useNavigate();
  const BASE_URL =  import.meta.env.VITE_BackendURL;

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
      <div className="bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 shadow-md">
          <div className="text-xl font-bold text-blue-600">BidHub</div>
          <div className="flex items-center space-x-4 w-full justify-center">
            {/* Search bar */}
            <div className="relative w-1/2">
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

            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={() => navigate("/auction/create")}
            >
              Create Auction
            </button>
          </div>
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              onClick={() => navigate("/user")}
            >
              <img
                src="https://www.w3schools.com/w3images/avatar2.png"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </button>
          </div>
        </div>

        {/* Live Auctions */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Live Auctions</h2>
          <div className="flex overflow-x-auto space-x-4">
            {filteredLiveAuctions.length > 0 ? (
              filteredLiveAuctions.map((item) => (
                <div
                  key={item._id}
                  className="flex-none w-60 border rounded-lg cursor-pointer hover:scale-105 transition-transform"
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
                  className="flex-none w-60 border rounded-lg cursor-pointer hover:scale-105 transition-transform"
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
