// addressSlice.js
import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    selectedAddress: null,
  },
  reducers: {
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    clearAddress: (state) => {
      state.selectedAddress = null;
    },
  },
});

export const { addAddress, selectAddress, clearAddress } = addressSlice.actions;
export default addressSlice.reducer;
