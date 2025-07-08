import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BackendURL;
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("Enter all the details!!");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        email,
        username,
        password,
      });
      if (response.status === 201) {
        localStorage.setItem("token", response.token);
        window.alert("registration successful!! Please login to continue..");
        navigate("/login");
      }
    } catch (err) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border-2 border-blue-400">
        <h1 className="text-5xl text-center font-bold text-blue-600 bg-green-100 px-3 py-1 rounded-lg shadow">
          BidHub
        </h1>
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-3 mt-4">
          Register
        </h2>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block font-semibold text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="username"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="email"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="password"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          >
            Register
          </button>
        </form>

        <div className="text-center">
          <span className="text-gray-500">Already have an account?</span>
          <button
            onClick={handleLoginRedirect}
            className="text-blue-600 hover:underline ml-1"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
