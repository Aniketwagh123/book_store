// src/layouts/MainLayout.js

import { Outlet } from "react-router-dom";
import AppBarComponent from "../components/AppBarComponent";
import Footer from "../components/Footer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCart } from "../slice/cartSlice"; // Updated thunk for cart
import { initializeBooks } from "../slice/bookSlice";
import { fetchUserInfo } from "../slice/authSlice";

const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchCart());        // Updated to fetchCart
      await dispatch(initializeBooks());
      await dispatch(fetchUserInfo());
    };

    fetchData(); // Call the async function
  }, [dispatch]);

  return (
    <div>
      <AppBarComponent />
      <div style={{ paddingBottom: "100px", paddingTop: "100px" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
