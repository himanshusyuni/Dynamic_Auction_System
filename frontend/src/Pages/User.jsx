import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
  }, []);

  // Handle editing and saving changes
  const handleChanges = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/user/profile",
        {
          email: userData.email, // Send only modifiable fields
          username: userData.username,
          dob: userData.dob,
          address: userData.address,
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Update failed. Please try again.");
    }
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Render profile section
  const renderProfileSection = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-10">
      <div className="flex mb-6">
        <img
          src={userData.userPic || "https://via.placeholder.com/150"}
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

      <div className="space-y-4">
        <div className="flex items-center">
          <label className="text-gray-700 w-36">Email</label>
          <input
            type="text"
            className="border rounded-md p-2 flex-1"
            value={userData.email}
            disabled
            style={{ backgroundColor: "#f3f4f6" }} // Greyed out
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
            style={{ backgroundColor: isEditing ? "white" : "#f3f4f6" }} // Greyed out when not editing
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
            } // Format the date to yyyy-MM-dd
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

  // Render purchased/sold items section
  const renderItemsSection = (title, items) => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src={item.imageUrl || "https://via.placeholder.com/200"}
              alt={item.name}
              className="w-full h-32 object-cover mb-4 rounded-lg"
            />
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Return loading/error state or main content
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
      {/* Left Sidebar */}
      <div className="w-1/4 bg-green-100 p-6 min-h-screen flex flex-col">
        <div className="space-y-8">
          <button
            className={`text-lg w-full p-2 rounded-md hover:bg-green-600 ${
              activeTab === "profile" ? "bg-green-600" : "bg-green-500"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`text-lg w-full p-2 rounded-md hover:bg-green-600 ${
              activeTab === "purchased" ? "bg-green-600" : "bg-green-500"
            }`}
            onClick={() => setActiveTab("purchased")}
          >
            Purchased Items
          </button>
          <button
            className={`text-lg w-full p-2 rounded-md hover:bg-green-600 ${
              activeTab === "sold" ? "bg-green-600" : "bg-green-500"
            }`}
            onClick={() => setActiveTab("sold")}
          >
            Sold Items
          </button>
        </div>

        {/* Back to Homepage Button at the Bottom */}
        <div className="mt-auto text-center">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            onClick={()=>navigate("/")}
          >
            Back to Homepage
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8">
        {activeTab === "profile" && renderProfileSection()}
        {activeTab === "purchased" &&
          renderItemsSection("Purchased Items", userData.purchasedItems)}
        {activeTab === "sold" &&
          renderItemsSection("Sold Items", userData.soldItems)}
      </div>
    </div>
  );
};

export default UserProfile;
