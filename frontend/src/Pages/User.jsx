import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Redirect from "../Components/Redirect";
import Header from "../Components/Header";

// const BASE_URL = "https://dynamic-auction-system.vercel.app/api"; // Add your base API
// URL

const BASE_URL = import.meta.env.VITE_BackendURL;

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
      let imageUrl = userData.profilePic;

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
          profilePic: imageUrl,
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
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const renderProfileSection = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-10">
      <div className="flex mb-6">
        <img
          src={
            selectedImage
              ? URL.createObjectURL(selectedImage)
              : userData.profilePic || "https://via.placeholder.com/150"
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
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start pt-20 ">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-8 border-2  border-blue-600">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
          </div>

          {/* Profile Content */}
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <img
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : userData.profilePic || "https://via.placeholder.com/150"
                }
                alt="User"
                className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
              />
              {isEditing && (
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-3 text-sm "
                />
              )}
            </div>

            {/* Profile Form */}
            <div className="flex-1 space-y-4">
              {/* Username */}
              <div>
                <label className="block text-gray-600 font-medium">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 size-8 focus:ring-2 focus:ring-blue-500"
                  value={userData.username}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-600 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-md p-2 size-8"
                  value={userData.email}
                  disabled
                />
              </div>

              {/* DOB */}
              <div>
                <label className="block text-gray-600 font-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 size-8"
                  value={
                    userData.dob
                      ? new Date(userData.dob).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setUserData({ ...userData, dob: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-600 font-medium">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 size-8"
                  value={userData.address}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* Action Buttons */}
              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                  onClick={handleEditToggle}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>

                {isEditing && (
                  <button
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    onClick={handleChanges}
                  >
                    Save Changes
                  </button>
                )}

                <button
                  className="ml-auto bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
