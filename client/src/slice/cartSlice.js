import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../services/cartService";


// Async thunk for fetching the cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await cartService.fetchCart();
  return response.data.items; // Ensure your backend sends `data.items`
});

// Async thunk for adding an item to the cart
export const addItem = createAsyncThunk(
  "cart/addItem",
  async ({ book, quantity }) => {
    const response = await cartService.addItemToCart(book, quantity); // Pass quantity
    return response.data;
  }
);

// Async thunk for removing an item from the cart
export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (bookId) => {
    await cartService.removeItemFromCart(bookId);
    return bookId;
  }
);

// New async thunk for updating item quantity
export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({ id, quantity }) => {
    const response = await cartService.updateItemQuantity(id, quantity);
    // console.log(response.data);

    return response.data;
  }
);

// Initial state of the cart
const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

// Cart slice definition
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
          // Calculate total quantity and price
          state.totalQuantity = action.payload.reduce(
            (total, item) => total + item.quantity,
            0
          );
          state.totalPrice = action.payload.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
        } else {
          console.error(
            "Expected payload to be an array but got:",
            action.payload
          );
          state.items = [];
          state.totalQuantity = 0;
          state.totalPrice = 0;
        }
        state.loading = false;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        const item = action.payload; // Assuming payload contains the updated item with quantity
        const existingItem = state.items.find((i) => i.book === item.book);

        if (existingItem) {
          // Update existing item's quantity and recalculate totals
          const quantityChange = item.quantity; // item.quantity is the new quantity
          existingItem.quantity += quantityChange;

          // Update total quantity and price
          state.totalQuantity += quantityChange;
          state.totalPrice += item.price * quantityChange; // Adjust for the price of the newly added quantity
        } else {
          // New item
          state.items.push(item); // Assuming item already has quantity set
          state.totalQuantity += item.quantity;
          state.totalPrice += item.price * item.quantity;
        }
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        const { book, quantity } = action.payload; // Ensure payload structure is correct
        const existingItem = state.items.find((i) => i.book === book);
        console.log(action.payload);

        if (existingItem) {
          const previousQuantity = existingItem.quantity;
          existingItem.quantity = quantity; // Update the quantity

          // Update the total quantity and price
          state.totalQuantity += quantity - previousQuantity;
          state.totalPrice +=
            quantity * existingItem.price -
            previousQuantity * existingItem.price;
        }
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        const bookId = action.payload;
        const item = state.items.find((i) => i.book === bookId);
        if (item) {
          state.totalQuantity -= item.quantity; // Decrease total quantity
          state.totalPrice -= item.price * item.quantity; // Decrease total price
          state.items = state.items.filter((i) => i.book !== bookId); // Remove item
        }
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

// Export the cart reducer
export const cartReducer = cartSlice.reducer;
