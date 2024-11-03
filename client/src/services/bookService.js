// bookService.js
import axios from "axios";

const API_BASE_URL = "http://0.0.0.0:8000/api"; // Update with your actual base URL

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    // If the token exists, set the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define the book service functions
export const bookService = {
  async fetchBooks() {
    const response = await axiosInstance.get("/book/");
    return response.data; // Return the data from the response
  },

  async fetchBookById(id) {
    const response = await axiosInstance.get(`/book/${id}/`);
    return response.data; // Return the data from the response
  },
};
