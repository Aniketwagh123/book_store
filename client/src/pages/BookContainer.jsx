import React from "react";
import BookCard from "../components/BookCard";
import { Grid, Typography, Container, Pagination } from "@mui/material";
import SortBar from "../components/SortBar";
import { useSelector } from "react-redux";

const BookContainer = () => {
  const books = useSelector((state) => state.books.items); // Access the books from the Redux store
  const [sort, setSort] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12; // Number of books per page

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  // Sort books based on the selected criteria
  const sortedBooks = [...books].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price; // Sort by price ascending
      case "price-desc":
        return b.price - a.price; // Sort by price descending
      case "rating":
        return b.rating - a.rating; // Sort by rating descending
      default:
        return 0; // No sorting
    }
  });

  // Calculate the current items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage); // Total pages based on items

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container>
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Books ({books.length} Items)
        </Typography>
        <SortBar sort={sort} handleSortChange={handleSortChange} />
      </div>
      <Grid container spacing={3}>
        {currentBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={totalPages}
        color="primary"
        shape="rounded"
        page={currentPage} // Set current page for controlled pagination
        onChange={handlePageChange} // Handle page change
        sx={{
          marginTop: 4,
          paddingBottom: 12,
          justifyContent: "center",
          display: "flex",
        }}
      />
    </Container>
  );
};

export default BookContainer;
