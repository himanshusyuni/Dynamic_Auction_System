import React, { useState, useEffect } from "react";

const ItemImageSlider = ({ itemPics }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (itemPics && itemPics.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === itemPics.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [itemPics]);

  return (
    <img
      src={itemPics[currentImageIndex] || "default-image-url"}
      alt="Auction Item"
      className="w-full h-96 object-cover rounded-lg shadow-md"
    />
  );
};

export default ItemImageSlider;
