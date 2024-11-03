import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Box, TextField, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slice/authSlice"; // Import the loginUser thunk
import "../pages/LoginSignup.scss";
import logo from "../assets/images/logo.png";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "35%",
  transform: "translate(-50%, -50%)",
};

const LoginModal = ({ open, handleClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const handleLogin = async () => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      handleClose(); // Close the modal only if login is successful
      if (onLoginSuccess) onLoginSuccess(); // Call onLoginSuccess if provided
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box sx={modalStyle}>
        <div className="login-container">
          <div className="logo-container">
            <img src={logo} alt="Logo" />
            <h3 style={{ marginTop: "10px" }}>ONLINE BOOK SHOPPING</h3>
          </div>
          <div className="form-container">
            <div className="form-header">
              <h2
                style={{
                  color: isLogin ? "maroon" : "gray",
                  cursor: "pointer",
                }}
                onClick={toggleForm}
              >
                LOGIN
              </h2>
              <h2
                style={{
                  color: isLogin ? "gray" : "maroon",
                  cursor: "pointer",
                }}
                onClick={toggleForm}
              >
                SIGNUP
              </h2>
            </div>
            <div className="login-form-body">
              {isLogin ? (
                <>
                  <label>Email Id</label>
                  <TextField
                    size="small"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label>Password</label>
                  <TextField
                    size="small"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    style={{
                      color: "gray",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  >
                    Forgot Password?
                  </label>
                  {status === "failed" && (
                    <p style={{ color: "red" }}>
                      {error?.message || "An error occurred"}
                    </p>
                  )}
                  <Button
                    variant="contained"
                    style={{ marginTop: "20px" }}
                    onClick={handleLogin}
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Logging in..." : "Login"}
                  </Button>
                </>
              ) : (
                <>
                  <label>Name</label>
                  <TextField size="small" fullWidth />
                  <label>Email Id</label>
                  <TextField size="small" fullWidth />
                  <label>Password</label>
                  <TextField size="small" type="password" fullWidth />
                  <Button variant="contained" style={{ marginTop: "20px" }}>
                    Signup
                  </Button>
                </>
              )}
            </div>
            <div className="login-form-footer">
              <hr style={{ border: "1px solid lightgray", width: "20%" }} />
              <h3>OR</h3>
              <hr style={{ border: "1px solid lightgray", width: "20%" }} />
            </div>
            <div className="footer-button">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#4266B2",
                  width: "100%",
                  marginRight: "4%",
                }}
              >
                Facebook
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "#db4437", width: "100%" }}
              >
                Google
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

LoginModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func, // Added prop type for onLoginSuccess
};

export default LoginModal;
