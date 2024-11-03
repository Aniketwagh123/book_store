// cartService.js

import axios from "axios";

// API base URL for cart and order operations
const API_BASE_URL = "http://0.0.0.0:8000/api";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cart services using the Axios instance
const cartService = {
  fetchCart: async () => {
    const response = await axiosInstance.get(`/cart/`);
    return response.data;
  },
  
  addItemToCart: async (bookId, quantity) => {
    const response = await axiosInstance.post(`/cart/item/${bookId}/`, { quantity });
    return response.data;
  },
  
  removeItemFromCart: async (bookId) => {
    await axiosInstance.delete(`/cart/item/${bookId}/`);
  },

  updateItemQuantity: async (bookId, quantity) => {
    const response = await axiosInstance.post(`/cart/item/${bookId}/`, { quantity });
    return response.data;
  },

};

export default cartService;
