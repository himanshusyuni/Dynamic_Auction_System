import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FaUser } from "react-icons/fa";

const socket = io(import.meta.env.VITE_SocketURL);

const ItemCard = ({ item }) => {
  const { itemPic, itemName, tags, _id, currPrice, sellerEmail } = item;
  const img = itemPic[0];
  const [currentPrice, setCurrentPrice] = useState(currPrice);
  const [currentEmail, setCurrentEmail] = useState(sellerEmail);

  useEffect(() => {
    socket.emit("joinAuction", _id);
    socket.on("bidUpdated", (data) => {
      if (_id === data.auctionId) {
        setCurrentPrice(data.highestBid);
        setCurrentEmail(data.bidderEmail);
      }
    });
    return () => {
      socket.off("bidUpdated");
    };
  }, [_id]);

  return (
    //<div className="bg-white rounded-lg shadow hover:shadow-md  overflow-hidden flex flex-col h-full border-2 border-blue-200 hover:border-green-300">
    <div className="bg-white rounded-lg shadow hover:shadow-md overflow-hidden flex flex-col h-full border-2 border-blue-200 hover:border-green-400 transition-all duration-200 ">
      {/* Image */}
      <img src={img} alt={itemName} className="w-full h-32 object-cover" />

      {/* Content */}
      <div className="p-3 flex flex-col justify-between flex-grow">
        {/* Item Name */}
        <h3 className="text-base font-semibold text-gray-800 truncate mb-1">
          {itemName}
        </h3>

        {/* Seller Info */}
        <div className="flex items-center text-xs text-gray-500 mb-1 truncate">
          <FaUser className="mr-1 text-xs" />
          {currentEmail}
        </div>

        {/* Current Price */}
        <div className="text-sm font-bold text-green-600 mb-1">
          ₹{currentPrice}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {tags.length > 0 ? (
            tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-[10px] font-medium px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No tags</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
