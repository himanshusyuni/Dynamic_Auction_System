import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Fill all the details!!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );
      setEmail("");
      setPassword("");

      if (response.status === 201) {
        localStorage.setItem("authToken", response.data.token);
        navigate("/user");
      }
    } catch (err) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google");
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Login
        </h2>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
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
            Login
          </button>
        </form>

        <div className="text-center mb-4">
          <span className="text-gray-500">OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
        >
          Login with Google
        </button>

        <div className="text-center">
          <span className="text-gray-500">Don't have an account?</span>
          <button
            onClick={handleRegisterRedirect}
            className="text-blue-600 hover:underline ml-1"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
