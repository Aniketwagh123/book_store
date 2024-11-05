import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../services/orderService";

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk("order/fetchOrders", async () => {
  const response = await orderService.fetchOrders();
  return response; // Assuming response contains a list of orders
});

// Async thunk for placing an order
export const placeOrder = createAsyncThunk("order/placeOrder", async () => {
  const response = await orderService.placeOrder();
  return response; // Assuming response contains order confirmation
});

// Async thunk for canceling an order
export const cancelOrder = createAsyncThunk("order/cancelOrder", async () => {
  const response = await orderService.cancelOrder();
  return response; // Assuming response contains cancelation confirmation
});

// Initial state of the order
const initialState = {
  orders: [],
  loading: false,
  error: null,
};

// Order slice definition
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload; // Assuming payload contains a list of orders
        state.loading = false;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload); // Assuming payload contains the placed order details
        state.loading = false;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const canceledOrder = action.payload; // Assuming payload contains canceled order details
        state.orders = state.orders.filter(
          (order) => order.id !== canceledOrder.id
        );
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message; // Handle error
        }
      );
  },
});

// Export the order reducer
export const orderReducer = orderSlice.reducer;
