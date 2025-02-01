import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "../Components/ItemCard";
import axios from "axios";
import Footer from "../Components/Footer";

const HomePage = () => {
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [completedAuctions, setCompletedAuctions] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [filteredLiveAuctions, setFilteredLiveAuctions] = useState([]); // Filtered live auctions
  const [filteredCompletedAuctions, setFilteredCompletedAuctions] = useState(
    []
  ); // Filtered completed auctions
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the auction list from the backend
    const fetchAuctions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/auction");

        if (response.status === 401) {
          console.log("PROBLEM IN FETCHING THE DATA");
          return;
        }
        const auctions = response.data.AuctionList;
        console.log(auctions);
        // Categorize auctions based on their status
        setLiveAuctions(
          auctions.filter((auction) => auction.auctionStatus === "live")
        );
        setCompletedAuctions(
          auctions.filter((auction) => auction.auctionStatus === "completed")
        );
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    // Filter auctions based on search query
    const filterAuctions = () => {
      const lowercasedQuery = searchQuery.toLowerCase();
      setFilteredLiveAuctions(
        liveAuctions.filter((auction) =>
          auction.tags.some((tag) =>
            tag.toLowerCase().includes(lowercasedQuery)
          )
        )
      );
      setFilteredCompletedAuctions(
        completedAuctions.filter((auction) =>
          auction.tags.some((tag) =>
            tag.toLowerCase().includes(lowercasedQuery)
          )
        )
      );
    };

    filterAuctions();
    if (searchQuery === "") {
      setFilteredCompletedAuctions(completedAuctions);
      setFilteredLiveAuctions(liveAuctions);
    }
  }, [searchQuery, liveAuctions, completedAuctions]); // Re-run filtering when search query or auctions change

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query as user types
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 shadow-md">
          <div className="text-xl font-bold text-blue-600">Auction System</div>
          <div className="flex items-center space-x-4 w-full justify-center">
            {/* Search bar */}
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="Search items..."
                className="px-4 py-2 border border-gray-300 rounded-lg w-full pl-10"
                value={searchQuery}
                onChange={handleSearchChange} // Update search query on input change
              />
              <button
                className="absolute right-0 top-0 bottom-0 px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                // Search button click handler
              >
                Search
              </button>
            </div>

            {/* Create Auction Button */}
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

        {/* Live Auctions Section */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Live Auctions</h2>
          <div className="flex overflow-x-auto overflow-y-hidden space-x-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-500">
            {filteredLiveAuctions.length > 0 ? (
              filteredLiveAuctions.map((item) => (
                <div
                  className="flex-none w-60 cursor-pointer transform transition-transform duration-300 hover:scale-105 border border-gray-300 rounded-lg"
                  onClick={() => navigate(`/auction/${item._id}`)} // Navigate to auction detail page
                >
                  <ItemCard key={item._id} item={item} />
                </div>
              ))
            ) : (
              <p>No live auctions match your search.</p>
            )}
          </div>
        </div>

        {/* Completed Auctions Section */}
        <div className="p-8 bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Completed Auctions</h2>
          <div className="flex overflow-x-auto overflow-y-hidden space-x-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-500">
            {filteredCompletedAuctions.length > 0 ? (
              filteredCompletedAuctions.map((item) => (
                <div
                  className="flex-none w-60 cursor-pointer transform transition-transform duration-300 hover:scale-105 border border-gray-300 rounded-lg"
                  onClick={() => navigate(`/auction/${item._id}`)} // Navigate to auction detail page
                >
                  <ItemCard key={item._id} item={item} />
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
