import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(  import.meta.env.VITE_SocketURL);

const ItemCard = ({ item }) => {
  const { itemPic, itemName, tags, _id, currPrice, sellerEmail } = item;
  const img = itemPic[0];
  const [currentPrice, setCurrentPrice] = useState(currPrice);
  const [currentEmail, setCurrentEmail] = useState(sellerEmail);

  useEffect(() => {
    socket.emit("joinAuction", _id);
    socket.on("bidUpdated", (data) => {
      console.log("Hii");
      if (_id == data.auctionId) {
        setCurrentPrice(data.highestBid);
        setCurrentEmail(data.bidderEmail);
      }
    });
    return () => {
      socket.off("bidUpdate");
    };
  }, [_id]);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full h-full flex flex-col">
      <img src={img} alt={itemName} className="w-full h-48 object-cover" />
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Item Name */}
          <h3 className="text-xl font-semibold text-gray-800">{itemName}</h3>

          {/* Seller Email */}
          <p className="text-sm text-gray-600">Seller: {currentEmail}</p>

          {/* Current Price */}
          <p className="text-lg font-bold text-blue-500 mt-2">
            ₹{currentPrice}
          </p>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Placeholder if no tags */}
          {tags.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">No tags available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
