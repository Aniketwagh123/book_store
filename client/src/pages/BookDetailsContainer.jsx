import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  Box,
  Divider,
} from "@mui/material";
import { Rating } from "@mui/material";
import ReviewCard from "../components/ReviewCard";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem, updateItemQuantity } from "../slice/cartSlice";
import { useEffect } from "react";
import { fetchBookById } from "../slice/bookSlice";

const BookDetailsContainer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBookById(parseInt(id, 10)));
  }, [dispatch, id]);

  const loading = useSelector((state) => state.books.loading);
  const error = useSelector((state) => state.books.error);
  const books = useSelector((state) => state.books.items);
  const book = books.find((book) => book.id === parseInt(id, 10));

  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.book === parseInt(id, 10));

  if (loading) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h5">Error: {error}</Typography>;
  }

  if (!book) {
    return <Typography variant="h5">Book not found.</Typography>;
  }

  const handleAddToCart = () => {
    if (!cartItem) {
      dispatch(
        addItem({
          book: id,
          quantity: 1,
          price: book.price,
        })
      );
    }
  };

  const handleIncrement = () => {
    if (cartItem) {
      console.log('cartItem');
      console.log(cartItem);
      
      dispatch(
        updateItemQuantity({
          id: cartItem.book,
          quantity: cartItem.quantity + 1,
        })
      );
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        dispatch(
          updateItemQuantity({
            id: cartItem.book,
            quantity: cartItem.quantity - 1,
          })
        );
      } else {
        dispatch(removeItem(cartItem.book));
      }
    }
  };

  return (
    <Container>
      <Grid container spacing={4} sx={{ marginTop: "2rem" }}>
        <Grid item xs={12} md={4}>
          <div
            style={{
              border: "1px solid #000",
              borderRadius: "5px",
              overflow: "hidden",
              padding: "20px",
            }}
          >
            <img
              src={book.imgSrc}
              alt={book.name}
              style={{ width: "100%", borderRadius: "5px" }}
            />
          </div>
          <Grid container spacing={2} sx={{ marginTop: "20px" }}>
            <Grid item>
              {cartItem && cartItem.quantity > 0 ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Button variant="outlined" onClick={handleDecrement}>
                    -
                  </Button>
                  <Typography>{cartItem.quantity}</Typography>
                  <Button variant="outlined" onClick={handleIncrement}>
                    +
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddToCart}
                >
                  ADD TO BAG
                </Button>
              )}
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary">
                WISHLIST
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {book.name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            by {book.author}
          </Typography>
          <Box display="flex" alignItems="center" mt={2}>
            <Rating value={book.rating} precision={0.5} readOnly />
            <Typography variant="body2" ml={1}>
              ({book.reviews})
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography variant="h6" color="textPrimary">
              Rs. {book.price}
            </Typography>
            {book.oldPrice && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textDecoration: "line-through", marginLeft: "10px" }}
              >
                Rs. {book.oldPrice}
              </Typography>
            )}
          </Box>
          <Divider>Book Details</Divider>
          <Typography variant="body1" color="textSecondary" mt={2}>
            {book.description}
          </Typography>
          <Divider>--</Divider>
          <Typography
            variant="h5"
            sx={{ marginTop: "40px", marginBottom: "10px" }}
          >
            Customer Feedback
          </Typography>
          <Box
            sx={{
              backgroundColor: "#F5F5F5",
              padding: "20px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              position: "relative",
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle1">Overall rating</Typography>
              <Rating value={0} precision={0.5} />
            </Box>
            <TextField
              fullWidth
              variant="outlined"
              label="Write your review"
              multiline
              rows={4}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: "10px" }}
              >
                Submit
              </Button>
            </Box>
          </Box>
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookDetailsContainer;
