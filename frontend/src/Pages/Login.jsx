import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const BASE_URL = "https://dynamic-auction-system.vercel.app/api"; // Define the base API URL

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
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });
      setEmail("");
      setPassword("");

      if (response.status === 201) {
        localStorage.setItem("authToken", response.data.token);
        navigate("/user");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const getUserEmail = async (accessToken) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
          },
        }
      );

      return response.data.email; // Return the email
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      localStorage.setItem("accessToken", tokenResponse.access_token);

      const email = await getUserEmail(tokenResponse.access_token);

      if (email) {
        try {
          const response = await axios.post(`${BASE_URL}/auth/google`, {
            email,
          }); // Use base URL for Google login API
          if (response.status === 201) {
            localStorage.setItem("authToken", response.data.token);
            navigate("/user");
          }
        } catch (err) {
          setError("Login Failed");
          console.log(err);
        }
      } else {
        setError("Failed to get email from Google.");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      setError("Google login failed");
    },
    scope:
      "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  });

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
          onClick={googleLogin}
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
