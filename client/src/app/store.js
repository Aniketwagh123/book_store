// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "../slice/bookSlice";
import { cartReducer } from "../slice/cartSlice";
import authReducer from '../slice/authSlice';
import addressReducer from '../slice/addressSlice';


export const store = configureStore({
  reducer: {
    books: bookReducer,
    cart: cartReducer,
    auth: authReducer,
    address: addressReducer,
  },
});

export default store;
