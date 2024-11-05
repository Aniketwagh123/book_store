import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Container,
  Menu,
  MenuItem,
  Tooltip,
  Button, // Import Button for clear action
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon, // Import the Close icon
  AccountCircle,
  ShoppingCart,
  Assignment as OrdersIcon,
  Favorite as WishlistIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import LoginModal from "./LoginModal";
import { fetchUserInfo, logout } from "../slice/authSlice";
import { fetchCart } from "../slice/cartSlice";
import { initializeBooks, filterBooks, clearSearch } from "../slice/bookSlice"; // Import clearSearch action

// Search bar styling
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.common.white}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.95),
  },
  marginLeft: theme.spacing(2),
  width: "100%",
  maxWidth: "600px",
  display: "flex",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "gray",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "gray",
  flexGrow: 1,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 0, 1.5, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "30ch",
      "&:focus": {
        width: "40ch",
      },
    },
  },
}));

const AppBarComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItemsCount = useSelector((state) => state.cart.items.length);
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginModalOpen = () => {
    setIsModalOpen(true);
    handleMenuClose();
  };

  const handleLoginModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(fetchCart());
    dispatch(initializeBooks());
    dispatch(fetchUserInfo());
    handleMenuClose();
  };

  const handleNavigate = (path) => {
    if (!user) {
      handleLoginModalOpen();
    } else {
      navigate(path);
      handleMenuClose();
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(filterBooks(value)); // Dispatch the action to filter books
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(clearSearch()); // Dispatch the action to clear search
  };

  return (
    <Container>
      <AppBar position="fixed" color="primary">
        <Toolbar sx={{ justifyContent: "space-around" }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src="/src/assets/icons/open-book.png" alt="" width={40} />
              <Typography variant="h6" noWrap component="div" sx={{ ml: 1 }}>
                Bookstore
              </Typography>
            </div>
          </Link>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search by Title or Author…"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && ( // Only show the clear button if there's a search term
              <IconButton onClick={handleClearSearch} sx={{ p: 1 }}>
                <CloseIcon />
              </IconButton>
            )}
          </Search>

          <div>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
            >
              {user ? (
                <>
                  <MenuItem onClick={handleMenuClose}>
                    Hello, {user.username}
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleLoginModalOpen}>Login/Signup</MenuItem>
              )}
              <Tooltip title="My Orders" arrow>
                <MenuItem onClick={() => handleNavigate("/my-orders")}>
                  <OrdersIcon style={{ marginRight: 8 }} />
                  My Orders
                </MenuItem>
              </Tooltip>
              <Tooltip title="My Wishlist" arrow>
                <MenuItem onClick={() => handleNavigate("/my-wishlist")}>
                  <WishlistIcon style={{ marginRight: 8 }} />
                  My Wishlist
                </MenuItem>
              </Tooltip>
              <Tooltip title="My Cart" arrow>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={() => handleNavigate("/my-cart")}
                >
                  <Badge badgeContent={cartItemsCount} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <LoginModal open={isModalOpen} onClose={handleLoginModalClose} />
    </Container>
  );
};

export default AppBarComponent;
