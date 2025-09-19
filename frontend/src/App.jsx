import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Contacts from "./pages/Contacts";
import EditContact from "./pages/EditContact";

function App() {
  const isAuth = !!localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuth ? <Navigate to="/contacts" /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacts" element={isAuth ? <Contacts /> : <Navigate to="/login" />} />
        <Route path="/contacts/edit/:id" element={isAuth ? <EditContact /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
