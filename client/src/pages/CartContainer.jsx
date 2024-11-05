import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Typography,
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { ArrowDropDown, ArrowRight } from "@mui/icons-material";
import { selectBooksByIds } from "../slice/bookSlice"; // Adjust path as necessary
import { addItem, removeItem, updateItemQuantity } from "../slice/cartSlice"; // Adjust path as necessary
import { addAddress } from "../slice/addressSlice"; // Adjust path as necessary
import { useNavigate } from "react-router-dom"; // Import useNavigate
import LoginModal from "../components/LoginModal";

const CartContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  const cartItems = useSelector((state) => state.cart.items);
  const bookIds = cartItems.map((item) => parseInt(item.book, 10));
  const booksInCart = useSelector((state) => selectBooksByIds(state, bookIds));
  const addresses = useSelector((state) => state.address.addresses); // Get addresses from state

  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
  });
  const [existingAddress, setExistingAddress] = useState("");
  const [, setShowAddressSelection] = useState(false);

  const handleIncreaseQuantity = (item) => {
    dispatch(
      updateItemQuantity({ id: item.book, quantity: item.quantity + 1 })
    );
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateItemQuantity({ id: item.book, quantity: item.quantity - 1 })
      );
    } else {
      dispatch(removeItem(item.book));
    }
  };

  const handleRemoveItem = (bookId) => {
    dispatch(removeItem(bookId));
  };

  const { user } = useSelector((state) => state.auth); // Access user from auth state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localStorageCartItems, setLocalStorageCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (user && storedCartItems) {
      // console.log("Current cart items:", cartItems);
      // console.log("Stored items in localStorage:", storedCartItems);

      // const newItemsInLocalStorage = storedCartItems.filter(
      //   (storedItem) =>
      //     !cartItems.some((cartItem) => cartItem.book === storedItem.book)
      // );

      // // Log the new items found in localStorage that are not in cartItems
      // console.log("New items in localStorage that are not in cartItems:", newItemsInLocalStorage);

      // Dispatch addItem for each new item and remove it from localStorage
      storedCartItems.forEach((item) => {
        dispatch(addItem({ book: item.book, quantity: item.quantity }));
      });

      localStorage.setItem("cart", JSON.stringify([]));
    }
  }, [user]);


  const handlePlaceOrder = () => {
    if (!user) {
      // If user is not logged in, show login modal
      const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
      setLocalStorageCartItems(storedCartItems);

      setIsModalOpen(true);
    } else {
      // If user is logged in, proceed with address selection
      setShowAddressSelection(true);
      setIsAddressOpen(true);
    }
  };
  const handleLoginModalClose = () => {
    console.log("___", cartItems);

    setIsModalOpen(false);
  };

  const handleContinue = () => {
    if (existingAddress || (address.fullName && address.phone)) {
      setIsOrderSummaryOpen(true);
      // setIsAddressOpen(false);
    } else {
      alert("Please select or enter an address.");
    }
  };

  const handleAddAddress = () => {
    if (
      address.fullName &&
      address.phone &&
      address.addressLine &&
      address.city &&
      address.state
    ) {
      dispatch(addAddress(address));
      setAddress({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
      });
      alert("Address added successfully!");
    } else {
      alert("Please fill in all address fields.");
    }
  };

  const handleCheckout = () => {
    setIsOrderSummaryOpen(false);
    navigate("/orderplacesuccess");
  };

  return (
    <div style={{ width: "80%", margin: "auto", marginBlock: "45px" }}>
      {/* {JSON.stringify(cartItems)} */}
      <div
        style={{
          border: "1px solid black",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h5">My Cart ({bookIds.length} items)</Typography>
        {cartItems.map((item) => {
          const book = booksInCart.find(
            (b) => b.id === parseInt(item.book, 10)
          );
          // console.log("booksInCart");
          // console.log(booksInCart);
          // console.log(item);

          return (
            <div
              key={item.book}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "0.5px solid black",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <img
                src={book?.imgSrc || "/placeholder-image.jpg"}
                alt={book?.title}
                style={{ width: "100px", height: "130px" }}
              />
              <div style={{ width: "30%" }}>
                <Typography variant="h6">{book?.name}</Typography>
                <Typography variant="body2">by {book?.author}</Typography>
                <Typography variant="h6" color="primary">
                  Rs. {book?.price}
                </Typography>
                <Typography variant="body2">
                  Rating: {book?.rating} ({book?.reviews} reviews)
                </Typography>
              </div>
              <div>
                <Button onClick={() => handleDecreaseQuantity(item)}>-</Button>
                <span>{item.quantity}</span>
                <Button onClick={() => handleIncreaseQuantity(item)}>+</Button>
              </div>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveItem(item.book)}
              >
                Remove
              </Button>
            </div>
          );
        })}
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </Box>
      </div>

      {/* Address Selection Section */}
      {/* Address Selection Section */}
      <Box sx={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => setIsAddressOpen(!isAddressOpen)}>
            {isAddressOpen ? <ArrowDropDown /> : <ArrowRight />}
          </IconButton>
          <Typography variant="h6">Select Address</Typography>
        </div>
        <Collapse in={isAddressOpen}>
          <Box sx={{ border: "0.5px solid black", padding: "20px" }}>
            <RadioGroup
              value={existingAddress}
              onChange={(e) => setExistingAddress(e.target.value)}
            >
              {addresses.map((addr, index) => (
                <FormControlLabel
                  key={index}
                  value={addr.fullName}
                  control={<Radio />}
                  label={`${addr.fullName} - ${addr.phone}, ${addr.addressLine}, ${addr.city}, ${addr.state}`}
                />
              ))}
            </RadioGroup>
            <Typography variant="subtitle1" marginY={1}>
              Add New Address
            </Typography>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={address.fullName}
              onChange={(e) =>
                setAddress({ ...address, fullName: e.target.value })
              }
            />
            <TextField
              label="Mobile Number"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={address.addressLine}
              onChange={(e) =>
                setAddress({ ...address, addressLine: e.target.value })
              }
            />
            <TextField
              label="City/Town"
              variant="outlined"
              fullWidth
              margin="normal"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <TextField
              label="State"
              variant="outlined"
              fullWidth
              margin="normal"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
            />
            <Box display="flex" justifyContent="flex-end" marginTop="10px">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddAddress}
              >
                Add Address
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleContinue}
                style={{ marginLeft: "10px" }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Order Summary Section */}
      <Box sx={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
          >
            {isOrderSummaryOpen ? <ArrowDropDown /> : <ArrowRight />}
          </IconButton>
          <Typography variant="h6">Order Summary</Typography>
        </div>
        <Collapse in={isOrderSummaryOpen}>
          <Box sx={{ border: "0.5px solid black", padding: "20px" }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => {
                    const book = booksInCart.find((b) => b.id === item.book);
                    return (
                      <TableRow key={item.book}>
                        <TableCell>{book?.name}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          Rs. {book?.price * item.quantity}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={2} align="right">
                      <strong>Total:</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>
                        Rs.{" "}
                        {cartItems.reduce((total, item) => {
                          const book = booksInCart.find(
                            (b) => b.id === item.book
                          );
                          return total + (book?.price * item.quantity || 0);
                        }, 0)}
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="flex-end" marginTop="10px">
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Box>
      <LoginModal
        open={isModalOpen}
        handleClose={handleLoginModalClose}
        onLoginSuccess={() => {
          console.log("localStorageCartItems");
          console.log(localStorageCartItems);
          console.log("cartItems");
          console.log(cartItems);
          handleLoginModalClose();
        }}
      />
    </div>
  );
};

export default CartContainer;
