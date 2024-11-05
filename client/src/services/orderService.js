// orderService.js
import axios from "axios";

const API_BASE_URL = "http://0.0.0.0:8000/api"; // Update with your actual base URL

// Reuse the existing Axios instance with interceptors set up
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

// Define the order service functions
export const orderService = {
  async fetchOrders() {
    try {
      const response = await axiosInstance.get("/order/");
      return response.data; // Return the data from the response
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error retrieving orders.");
    }
  },

  async placeOrder() {
    try {
      const response = await axiosInstance.post("/order/");
      return response.data; // Return the data from the response
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error placing order.");
    }
  },

  async cancelOrder() {
    try {
      const response = await axiosInstance.patch("/order/");
      return response.data; // Return the data from the response
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error canceling order.");
    }
  },
};
