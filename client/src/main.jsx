import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material";
import App from "./App.jsx";
import "./index.css";

const theme = createTheme({
  palette: {
    primary: {
      main: '#8D3A33',  // Deep red for primary elements like header
    },
    secondary: {
      main: '#C3423F',  // Lighter red for secondary actions or buttons
    },
    background: {
      default: '#FFFFFF',  // White background
      paper: '#F5F5F5',    // Light grey for cards or container background
    },
    success: {
      main: '#4CAF50',     // Green for badges like ratings
    },
    text: {
      primary: '#333333',  // Dark grey for main text
      secondary: '#757575' // Lighter grey for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',  // Default font
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
