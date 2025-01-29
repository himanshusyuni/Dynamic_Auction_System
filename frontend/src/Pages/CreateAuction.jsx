import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const CreateAuctionPage = () => {
  const [itemName, setItemName] = useState("");
  const [image, setImage] = useState(null);
  const [startingPrice, setStartingPrice] = useState(100);
  const [auctionTime, setAuctionTime] = useState(24); // Default to 24 hours
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const handleTagAdd = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName.trim()) {
      alert("Item Name is required.");
      return;
    }

    if (
      !startingPrice ||
      isNaN(Number(startingPrice)) ||
      Number(startingPrice) <= 0
    ) {
      alert("Starting Price must be a valid positive number.");
      return;
    }

    try {
      const auctionData = {
        itemName: itemName,
        itemPic: image,
        currPrice: Number(startingPrice),
        description,
        tags,
        auctionTime: Number(auctionTime),
        token,
      };

      const response = await axios.post(
        "http://localhost:3000/api/auction/create",
        auctionData
      );

      if (response.status === 201) {
        console.log("Your Auction is LIVE");
        navigate("/");
      }
    } catch (err) {
      console.log("Problem in creating auction", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg">
        {/* Go Back Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-purple-500 text-white px-4 py-2 rounded-md mb-6 hover:bg-purple-600 transition"
        >
          Go Back
        </button>

        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Create Auction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Name */}
          <div className="mb-4">
            <label
              htmlFor="itemName"
              className="block text-gray-700 font-medium"
            >
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="itemName"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          {/* Image */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-medium">
              Item Image
            </label>
            <input
              type="file"
              id="image"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Starting Price */}
          <div className="mb-4">
            <label
              htmlFor="startingPrice"
              className="block text-gray-700 font-medium"
            >
              Starting Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="startingPrice"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              required
            />
          </div>

          {/* Auction Time */}
          <div className="mb-4">
            <label
              htmlFor="auctionTime"
              className="block text-gray-700 font-medium"
            >
              Auction Time (hours)
            </label>
            <input
              type="number"
              id="auctionTime"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={auctionTime}
              onChange={(e) => setAuctionTime(e.target.value)}
              min="1"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-700 font-medium">
              Tags
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="tags"
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                onClick={handleTagAdd}
              >
                Add Tag
              </button>
            </div>
            <div className="mt-2">
              <ul className="flex flex-wrap space-x-2">
                {tags.map((tag, index) => (
                  <li
                    key={index}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleTagDelete(tag)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
            >
              Create Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionPage;
