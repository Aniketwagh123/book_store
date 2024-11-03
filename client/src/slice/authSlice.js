// src/slice/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunk for handling login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authService.login(payload);

      // Save tokens to localStorage
      localStorage.setItem("accessToken", data.tokens.access);
      localStorage.setItem("refreshToken", data.tokens.refresh);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "An unknown error occurred" }
      );
    }
  }
);

// New Thunk for fetching user info
export const fetchUserInfo = createAsyncThunk(
  "auth/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("accessToken"); // Get token from localStorage

    if (!token) {
      return rejectWithValue({ message: "No token found" });
    }

    try {
      const response = await authService.getUserInfo(token);
      return response; // Return user data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch user info" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.data;
        state.accessToken = action.payload.tokens.access;
        state.refreshToken = action.payload.tokens.refresh;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Ensure this is an object with a `message` property
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user = action.payload.data; // Update user data in the state
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        console.error("Failed to fetch user info:", action.payload);
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
