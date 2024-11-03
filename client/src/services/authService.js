// src/services/authService.js

import axios from 'axios';

const BASE_URL = 'http://0.0.0.0:8000/auth/login/';
const USER_INFO_URL = 'http://0.0.0.0:8000/auth/user/'; // New endpoint for user info

const login = async (payload) => {
  const response = await axios.post(BASE_URL, payload);
  return response.data;
};

// New function to get user info
const getUserInfo = async (token) => {
  const response = await axios.get(USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${token}`, // Set the Authorization header
    },
  });
  return response.data;
};

export default { login, getUserInfo }; // Export the new function
