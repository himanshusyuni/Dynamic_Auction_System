import React, { useState } from "react";

const ItemCard = ({ item }) => {
  const { itemPic, sellerEmail, itemName, currPrice, tags } = item;
  const img = itemPic[0];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-sm w-full">
      {/* Item Image */}
      <img src={img} alt={itemName} className="w-full h-48 object-cover" />

      {/* Item Details */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{itemName}</h3>
        <p className="text-sm text-gray-600">Seller: {sellerEmail}</p>

        {/* Current Price */}
        <p className="text-lg font-bold text-blue-500 mt-2">₹{currPrice}</p>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap space-x-2">
          {tags.map((tag, index) => (
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
  );
};

export default ItemCard;
