import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://dynamic-auction-system.vercel.app/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setUpdatedData({ dateOfBirth: userData.dateOfBirth, address: userData.address });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        "https://dynamic-auction-system.vercel.app/api/user/update-profile",
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">User Profile</h2>

        {/* User Info */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Username:</span>
            <span className="text-gray-600">{userData.username || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Email:</span>
            <span className="text-gray-600">{userData.email || "N/A"}</span>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={updatedData.dateOfBirth || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Address:</label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={updatedData.address || ""}
                  onChange={handleInputChange}
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Date of Birth:</span>
                <span className="text-gray-600">{userData.dateOfBirth || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Address:</span>
                <span className="text-gray-600">{userData.address || "N/A"}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleEditToggle}
            className="w-full bg-purple-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-purple-600 transition"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
