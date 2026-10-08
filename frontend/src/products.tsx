
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  image_url?: string;
  stock: number;
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) =>
        console.error("Products error:", error)
      );
  }, []);

  // Add product to cart
  const addToCart = (product: Product) => {
    const savedCart = localStorage.getItem("cart");

    const cart: Product[] = savedCart
      ? JSON.parse(savedCart)
      : [];

    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      alert("Product already in cart");
      return;
    }

    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart 🛒");
  };

  // Search products
  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="products-container">

        <h1>ShopEasy Products</h1>

        {/* Search */}
        <input
          className="search-box"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Products */}
        <div className="product-grid">

          {filteredProducts.map((product) => (

            <div
              className="product-card"
              key={product.id}
            >

              {/* Product Image */}
              <img
                className="product-image"
                src={
                  product.image_url ||
                  product.image ||
                  "https://placehold.co/300x200?text=Product"
                }
                alt={product.name}
              />

              {/* Product Name */}
              <h3>{product.name}</h3>

              {/* Description */}
              <p className="description">
                {product.description}
              </p>

              {/* Price */}
              <h4>₹{product.price}</h4>

              {/* Stock */}
              <p className="stock">
                Stock: {product.stock}
              </p>

              {/* Add Cart */}
              <button
                className="add-cart-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart 🛒
              </button>

              {/* View Details */}
              <button
                className="view-details-btn"
                onClick={() =>
                  navigate(`/product/${product.id}`)
                }
              >
                View Details
              </button>

            </div>

          ))}

        </div>

        {/* No Products */}
        {filteredProducts.length === 0 && (
          <p className="no-products">
            No products found.
          </p>
        )}

      </div>
    </div>
  );
}

export default Products;

