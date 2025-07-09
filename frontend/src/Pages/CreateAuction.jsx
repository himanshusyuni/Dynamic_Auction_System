import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Redirect from "../Components/Redirect";
import Header from "../Components/Header";
import { FaHome, FaUser } from "react-icons/fa";
import Footer from "../Components/Footer";
import { message } from "antd";

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
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-3 flex items-center justify-between">
        {/* Left: BidHub Logo */}
        <div
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          BidHub
        </div>

        {/* Right: Navigation Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-white bg-gray-700 px-4 py-2 rounded hover:bg-gray-800"
          >
            <FaHome />
            Home
          </button>

          <button
            onClick={() => navigate("/user")}
            className="flex items-center gap-2 text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            <FaUser />
            Profile
          </button>
        </div>
      </header>
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start pt-20 ">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 border-2 border-blue-600 p-5 rounded-lg shadow-lg"
        >
          {/* Row 1: Item Name + Starting Price */}
          <h1 className="text-2xl font-bold text-center mb-5">
            Create Auction
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-md p-1"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              {errors.itemName && (
                <p className="text-red-500 text-sm mt-1">{errors.itemName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Starting Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                className="w-full mt-1 border border-gray-300 rounded-md p-1"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
              />
              {errors.startingPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startingPrice}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Auction Time + Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium">
                Auction Time (hours)
              </label>
              <input
                type="number"
                min="1"
                className="w-full mt-1 border border-gray-300 rounded-md p-1"
                value={auctionTime}
                onChange={(e) => setAuctionTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-1"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleTagDelete(tag)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Description (Full Width) */}
          <div>
            <label className="block text-gray-700 font-medium">
              Description
            </label>
            <textarea
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Row 4: Images (Full Width) */}
          <div>
            <label className="block text-gray-700 font-medium">
              Item Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              onChange={handleImageUpload}
            />
            {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt="Uploaded"
                    className="w-full h-28 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(url)}
                    className="absolute top-1 right-1 text-white bg-red-600 rounded-full px-2 py-1 text-sm opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg"
            >
              Create Auction
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
    // <div className="bg-gray-100 min-h-screen flex justify-center items-center">
    //   <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg">
    //     <button
    //       onClick={() => navigate("/")}
    //       className="bg-purple-500 text-white px-4 py-2 rounded-md mb-6 hover:bg-purple-600 transition"
    //     >
    //       Go Back
    //     </button>

    //     <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
    //       Create Auction
    //     </h2>

    //     <form onSubmit={handleSubmit} className="space-y-6">
    //       {/* Item Name */}
    //       <div className="mb-4">
    //         <label
    //           htmlFor="itemName"
    //           className="block text-gray-700 font-medium"
    //         >
    //           Item Name <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           type="text"
    //           id="itemName"
    //           className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           value={itemName}
    //           onChange={(e) => setItemName(e.target.value)}
    //         />
    //         {errors.itemName && (
    //           <p className="text-red-500 text-sm mt-1">{errors.itemName}</p>
    //         )}
    //       </div>

    //       {/* Image Upload */}
    //       <div className="mb-4">
    //         <label htmlFor="image" className="block text-gray-700 font-medium">
    //           Item Images <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           type="file"
    //           id="image"
    //           multiple
    //           className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           onChange={handleImageUpload}
    //         />
    //         {uploading && <p>Uploading images...</p>}
    //         {errors.images && (
    //           <p className="text-red-500 text-sm mt-1">{errors.images}</p>
    //         )}
    //         <div className="mt-4 grid grid-cols-3 gap-4">
    //           {images.map((imageUrl, index) => (
    //             <div key={index} className="relative">
    //               <img
    //                 src={imageUrl}
    //                 alt="Uploaded Item"
    //                 className="w-full rounded-md"
    //               />
    //               <button
    //                 type="button"
    //                 onClick={() => handleImageRemove(imageUrl)}
    //                 className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
    //               >
    //                 &times;
    //               </button>
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       {/* Starting Price */}
    //       <div className="mb-4">
    //         <label
    //           htmlFor="startingPrice"
    //           className="block text-gray-700 font-medium"
    //         >
    //           Starting Price <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           type="number"
    //           id="startingPrice"
    //           className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           value={startingPrice}
    //           onChange={(e) => setStartingPrice(e.target.value)}
    //         />
    //         {errors.startingPrice && (
    //           <p className="text-red-500 text-sm mt-1">
    //             {errors.startingPrice}
    //           </p>
    //         )}
    //       </div>

    //       {/* Auction Time */}
    //       <div className="mb-4">
    //         <label
    //           htmlFor="auctionTime"
    //           className="block text-gray-700 font-medium"
    //         >
    //           Auction Time (hours)
    //         </label>
    //         <input
    //           type="number"
    //           id="auctionTime"
    //           className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           value={auctionTime}
    //           onChange={(e) => setAuctionTime(e.target.value)}
    //           min="1"
    //         />
    //       </div>

    //       {/* Description */}
    //       <div className="mb-4">
    //         <label
    //           htmlFor="description"
    //           className="block text-gray-700 font-medium"
    //         >
    //           Description
    //         </label>
    //         <textarea
    //           id="description"
    //           className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           rows="4"
    //           value={description}
    //           onChange={(e) => setDescription(e.target.value)}
    //         />
    //       </div>

    //       {/* Tags */}
    //       <div className="mb-4">
    //         <label htmlFor="tags" className="block text-gray-700 font-medium">
    //           Tags
    //         </label>
    //         <div className="flex items-center space-x-2">
    //           <input
    //             type="text"
    //             id="tags"
    //             className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
    //             value={newTag}
    //             onChange={(e) => setNewTag(e.target.value)}
    //           />
    //           <button
    //             type="button"
    //             className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
    //             onClick={handleTagAdd}
    //           >
    //             Add Tag
    //           </button>
    //         </div>
    //         <div className="mt-2">
    //           <ul className="flex flex-wrap space-x-2">
    //             {tags.map((tag, index) => (
    //               <li
    //                 key={index}
    //                 className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full flex items-center space-x-2"
    //               >
    //                 <span>{tag}</span>
    //                 <button
    //                   type="button"
    //                   className="text-red-500 hover:text-red-700 focus:outline-none ml-1"
    //                   onClick={() => handleTagDelete(tag)}
    //                 >
    //                   &times;
    //                 </button>
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //       </div>

    //       <button
    //         type="submit"
    //         className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
    //       >
    //         Create Auction
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
};

export default CreateAuctionPage;
