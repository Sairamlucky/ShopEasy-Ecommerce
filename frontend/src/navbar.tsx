import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2
        className="logo"
        onClick={() => navigate("/")}
      >
        ShopEasy
      </h2>

      <input
        type="text"
        placeholder="Search products..."
      />

      <div className="nav-buttons">
        <button onClick={() => navigate("/login")}>
          Login
        </button>

        <button onClick={() => navigate("/register")}>
          Register
        </button>
        <button onClick={() => navigate("/orders")}>
  My Orders
</button>
        <button onClick={() => navigate("/cart")}>
          Cart 🛒
        </button>
      </div>
    </nav>
  );
}

export default Navbar;