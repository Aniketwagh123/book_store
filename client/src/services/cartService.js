// cartService.js

import axios from "axios";
import { jwtDecode } from "jwt-decode";

// API base URL for cart and order operations
const API_BASE_URL = "http://0.0.0.0:8000/api";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Helper function to check if the token is valid and not expired
const isTokenValid = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  }
  return false;
};

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (isTokenValid()) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalized response for localStorage fallback
const normalizeLocalStorageResponse = (message, data) => {
  return {
    message,
    status: "success",
    data: {
      ...data,
      cart: 1, // Dummy cart ID for consistency with API response
    },
  };
};

const getLocalStorageCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return {
    message: "Cart retrieved successfully.",
    status: "success",
    data: {
      total_price: totalPrice,
      total_quantity: totalQuantity,
      is_ordered: false,
      user: null, // No user when not logged in
      items: cart,
    },
  };
};

// Update localStorage cart function to ensure consistent messages
const updateLocalStorageCart = (bookId, quantity) => {
  bookId = parseInt(bookId, 10);
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemIndex = cart.findIndex((item) => item.book === bookId);

  if (itemIndex !== -1) {
    cart[itemIndex].quantity = quantity;
  } else {
    cart.push({ book: bookId, quantity});
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // Standardize response message to match logged-in response
  const response = normalizeLocalStorageResponse(
    "Item added to cart.",
    cart.find((item) => item.book === bookId) || {}
  );
//   console.log("LocalStorage addItemToCart fallback:", response);
  return response;
};

const removeLocalStorageCartItem = (bookId) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const updatedCart = cart.filter((item) => item.book !== bookId);
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  const response = normalizeLocalStorageResponse("Item removed from cart.", {
    book: bookId,
  });
//   console.log("LocalStorage removeItemFromCart response:", response);
  return response;
};

// Cart services using the Axios instance
const cartService = {
  fetchCart: async () => {
    if (isTokenValid()) {
      // Logged-in user: retrieve cart via API
      try {
        const response = await axiosInstance.get(`/cart/`);
        // console.log("API fetchCart response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching cart from server:", error);
        return getLocalStorageCart(); // Fallback to localStorage if there's an error
      }
    } else {
      // Not logged in: retrieve cart from localStorage
      const response = getLocalStorageCart();
    //   console.log("LocalStorage fetchCart response:", response);
      return response;
    }
  },
  addItemToCart: async (bookId, quantity) => {
    if (isTokenValid()) {
      try {
        const response = await axiosInstance.post(`/cart/item/${bookId}/`, {
          quantity,
        });
        // console.log("API addItemToCart response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error adding item to server cart:", error);
      }
    } else {
      const response = updateLocalStorageCart(bookId, quantity);
    //   console.log("LocalStorage addItemToCart fallback:", response);
      return response;
    }
  },

  removeItemFromCart: async (bookId) => {
    if (isTokenValid()) {
      try {
        await axiosInstance.delete(`/cart/item/${bookId}/`);
        const response = normalizeLocalStorageResponse(
          "Item removed from cart.",
          { book: bookId }
        );
        // console.log("API removeItemFromCart response:", response);
        return response;
      } catch (error) {
        console.error("Error removing item from server cart:", error);
      }
    } else {
      const response = removeLocalStorageCartItem(bookId);
    //   console.log("LocalStorage removeItemFromCart fallback:", response);
      return response;
    }
  },

  updateItemQuantity: async (bookId, quantity) => {
    if (isTokenValid()) {
      try {
        const response = await axiosInstance.post(`/cart/item/${bookId}/`, {
          quantity,
        });
        // console.log("API updateItemQuantity response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error updating item on server cart:", error);
      }
    } else {
      const response = updateLocalStorageCart(bookId, quantity);
    //   console.log("LocalStorage updateItemQuantity fallback:", response);
      return response;
    }
  },
};

export default cartService;
