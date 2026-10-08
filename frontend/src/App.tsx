import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Products from "./Products";
import Login from "./Login";
import Register from "./Register";
import Cart from "./Cart";
import Orders from "./Orders";
import AdminDashboard from "./AdminDashboard";
import ProductDetails from "./ProductDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path = "/orders" element = {<Orders />} />
        <Route path  ="/admin" element={<AdminDashboard />}/>
        <Route
  path="/product/:id"
  element={<ProductDetails />}
/>
  

      </Routes>
    </BrowserRouter>
  );
}

export default App;