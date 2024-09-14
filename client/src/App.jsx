import React, { useState, useEffect } from "react";
import './App.css';
import axios from 'axios';
import { ToastContainer } from "react-toastify";
import { Routes, Router } from "react-router-dom";

import Login from "./Pages/Login.jsx";

axios.defaults.baseURL = import.meta.env.SERVER_URL;

function App() {
  const [Load, setLoad] = useState(false);
  const [LoggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const generate_session = async () => {
      try {
        await axios.get("/");
        setLoad(true);
        const res = await axios.get("/auth/islogin");
        setLoggedIn(res.data.success);
      } catch (error) {
        alert("Error connecting to server!!!");
      }
    }
    generate_session();
  }, []);

  if (!Load) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}><h1>Error Connecting to Server!!! Please Try Again Later</h1></div>;

  else if (!LoggedIn) return <Login />

  else if (LoggedIn) return (
    <>
      <Routes>
        {/* <Route path="/" element={<Landing />} />
          <Route path="/join" element={<Join />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tnc" element={<TNC />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/login-signup" element={<LoginSignup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition="Bounce"
      />
    </>
  )
}

export default App
