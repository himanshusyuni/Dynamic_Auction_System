import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Redirect from "../Components/Redirect";

const BASE_URL = "https://dynamic-auction-system.vercel.app/api"; // Add your base API URL

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  // Check token before rendering
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Redirect />;
  }

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.user);
      } catch (error) {
        setError(
          error.message || "Error fetching user data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [token]);

  const handleChanges = async () => {
    try {
      let imageUrl = userData.userPic;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", "Auction_System");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dmgnrl8zf/image/upload",
          formData
        );
        imageUrl = response.data.secure_url;
      }

      const updateResponse = await axios.patch(
        `${BASE_URL}/user/profile`,
        {
          email: userData.email,
          username: userData.username,
          dob: userData.dob,
          address: userData.address,
          userPic: imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (updateResponse.status === 200) {
        setIsEditing(false);
        setSelectedImage(null);
        window.location.reload();
      } else {
        throw new Error("Failed to update profile. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Update failed. Please try again.");
    }
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const renderProfileSection = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-10">
      <div className="flex mb-6">
        <img
          src={
            selectedImage
              ? URL.createObjectURL(selectedImage)
              : userData.userPic || "https://via.placeholder.com/150"
          }
          alt="User Profile"
          className="w-32 h-32 rounded-full object-cover shadow-lg"
        />
        <div className="ml-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Hello, {userData.username}!
          </h1>
          <p className="text-xl text-gray-600 mt-2">{userData.email}</p>
        </div>
      </div>

      {isEditing && (
        <div className="mb-4">
          <label className="block text-gray-700">Change Profile Picture:</label>
          <input type="file" onChange={handleImageChange} className="mt-2" />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center">
          <label className="text-gray-700 w-36">Email</label>
          <input
            type="text"
            className="border rounded-md p-2 flex-1"
            value={userData.email}
            disabled
            style={{ backgroundColor: "#f3f4f6" }}
          />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 w-36">Username</label>
          <input
            type="text"
            className="border rounded-md p-2 flex-1"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
            disabled={!isEditing}
            style={{ backgroundColor: isEditing ? "white" : "#f3f4f6" }}
          />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 w-36">Date of Birth</label>
          <input
            type="date"
            className="border rounded-md p-2 flex-1"
            value={
              userData.dob
                ? new Date(userData.dob).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 w-36">Address</label>
          <input
            type="text"
            className="border rounded-md p-2 flex-1"
            value={userData.address}
            onChange={(e) =>
              setUserData({ ...userData, address: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          onClick={handleEditToggle}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
        {isEditing && (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 ml-4"
            onClick={handleChanges}
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center text-xl text-gray-500 py-10">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 w-12 h-12 mx-auto"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold py-10">
        {error}
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="w-1/4 bg-green-100 p-6 min-h-screen flex flex-col">
        <div className="space-y-8">
          <button
            className="text-lg w-full p-2 rounded-md bg-green-500 hover:bg-green-600"
            onClick={() => setIsEditing(true)}
          >
            Profile
          </button>
        </div>
        <div className="mt-auto text-center space-y-4">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            Back to Homepage
          </button>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
      <div className="w-3/4 p-8">{renderProfileSection()}</div>
    </div>
  );
};

export default UserProfile;
