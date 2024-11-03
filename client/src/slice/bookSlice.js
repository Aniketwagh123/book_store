import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookService } from "../services/bookService"; // Adjust the import path as necessary

// Create async thunk to fetch books
export const initializeBooks = createAsyncThunk(
  "books/initializeBooks",
  async () => {
    const books = await bookService.fetchBooks();
    return books.data;
  }
);

// Create async thunk to fetch a single book by ID
export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (id) => {
    const book = await bookService.fetchBookById(id);
    return book;
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Set the fetched books
      })
      .addCase(initializeBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((book) =>
          book.id === action.payload.id ? action.payload : book
        ); // Update the specific book
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Selector to get multiple books by an array of IDs
export const selectBooksByIds = (state, ids) =>
  state.books.items.filter((book) => ids.includes(book.id));

export default bookSlice.reducer;
