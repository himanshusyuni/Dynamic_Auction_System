import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Redirect from "../Components/Redirect";

const BASE_URL = "https://dynamic-auction-system.vercel.app/api"; // Define the base API URL

const CreateAuctionPage = () => {
  const [itemName, setItemName] = useState("");
  const [images, setImages] = useState([]);
  const [startingPrice, setStartingPrice] = useState(100);
  const [auctionTime, setAuctionTime] = useState(24);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const cloudName = "dmgnrl8zf"; // Your Cloudinary cloud name
  const uploadPreset = "Auction_System"; // Your Cloudinary unsigned upload preset

  const handleTagAdd = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const imageUploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        return response.data.secure_url;
      });

      const uploadedImages = await Promise.all(imageUploadPromises); // Use Promise.all to resolve all promises
      setImages((prevImages) => [...prevImages, ...uploadedImages]); // Flatten the image array
    } catch (err) {
      console.error("Error uploading images:", err);
      alert("Failed to upload images. Please try again.");
    }

    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for item name and price (already in place)
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

    // Validation for image upload
    if (images.length === 0) {
      alert("At least one image is required.");
      return;
    }

    try {
      const auctionData = {
        itemName,
        itemPic: images,
        currPrice: Number(startingPrice),
        description,
        tags,
        auctionTime: Number(auctionTime),
        token,
      };

      const response = await axios.post(
        `${BASE_URL}/auction/create`,
        auctionData
      ); // Use the base URL

      if (response.status === 201) {
        console.log("Your Auction is LIVE");

        navigate("/");
      }
    } catch (err) {
      console.log("Problem in creating auction", err);
    }
  };

  if (!token) return <Redirect />;

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg">
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

          {/* Image Upload */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-medium">
              Item Images
            </label>
            <input
              type="file"
              id="image"
              multiple
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleImageUpload}
            />
            {uploading && <p>Uploading images...</p>}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt="Uploaded Item"
                  className="w-full rounded-md"
                />
              ))}
            </div>
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
