import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Redirect from "../Components/Redirect";

const BASE_URL = import.meta.env.VITE_BackendURL;

const CreateAuctionPage = () => {
  const [itemName, setItemName] = useState("");
  const [images, setImages] = useState([]);
  const [startingPrice, setStartingPrice] = useState(100);
  const [auctionTime, setAuctionTime] = useState(24);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const cloudName = import.meta.env.VITE_CloudName;
  const uploadPreset = import.meta.env.VITE_UploadPreset;

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

      const uploadedImages = await Promise.all(imageUploadPromises);
      setImages((prevImages) => [...prevImages, ...uploadedImages]);
    } catch (err) {
      console.error("Error uploading images:", err);
      setErrors((prevErrors) => ({
        ...prevErrors,
        imageUpload: "Failed to upload images. Please try again.",
      }));
    }

    setUploading(false);
  };

  const handleImageRemove = (imageUrl) => {
    setImages(images.filter((url) => url !== imageUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!itemName.trim()) {
      validationErrors.itemName = "Item Name is required.";
    }

    if (
      !startingPrice ||
      isNaN(Number(startingPrice)) ||
      Number(startingPrice) <= 0
    ) {
      validationErrors.startingPrice =
        "Starting Price must be a valid positive number.";
    }

    if (images.length === 0) {
      validationErrors.images = "At least one image is required.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

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
      );

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
            />
            {errors.itemName && (
              <p className="text-red-500 text-sm mt-1">{errors.itemName}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-medium">
              Item Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="image"
              multiple
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleImageUpload}
            />
            {uploading && <p>Uploading images...</p>}
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt="Uploaded Item"
                    className="w-full rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(imageUrl)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                  >
                    &times;
                  </button>
                </div>
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
            />
            {errors.startingPrice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.startingPrice}
              </p>
            )}
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
                      className="text-red-500 hover:text-red-700 focus:outline-none ml-1"
                      onClick={() => handleTagDelete(tag)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Create Auction
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionPage;
