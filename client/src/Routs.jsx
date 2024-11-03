import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import BookContainer from "./pages/bookContainer";
import BookDetailsContainer from "./pages/bookDetailsContainer";
import CartContainer from "./pages/CartContainer";
import Login from "./pages/LoginSignup";
import OrderPlaced from "./pages/OrderPlaced";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <BookContainer />,
      },
      {
        path: "cart", // Route for book details with dynamic ID
        element: <CartContainer />,
      },
      {
        path: "wishlist", // Route for book details with dynamic ID
        element: <Login/>,
      },
      {
        path: "books/:id", // Route for book details with dynamic ID
        element: <BookDetailsContainer />,
      },
      {
        path: "orderplacesuccess", // Route for book details with dynamic ID
        element: <OrderPlaced />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default router;
