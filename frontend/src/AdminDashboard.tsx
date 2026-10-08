import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  stock: number;
}

function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Products error:", error);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <h2>Access Denied ❌</h2>
          <button onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,description,price: Number(price),image,stock: Number(stock),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Product added successfully ✅");

        setName("");
        setDescription("");
        setPrice("");
        setImage("");
        setStock("");

        fetchProducts();
      } else {
        alert(data.error || data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };
   const handleEditProduct = async (product: Product) => {
  const newName = window.prompt("Product name:", product.name);
  if (!newName) return;

  const newDescription = window.prompt(
    "Description:",
    product.description
  );
  if (!newDescription) return;

  const newPrice = window.prompt(
    "Price:",
    String(product.price)
  );
  if (!newPrice) return;

  const newStock = window.prompt(
    "Stock:",
    String(product.stock)
  );
  if (!newStock) return;

  try {
    const response = await fetch(
      `http://localhost:5000/products/${product.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          price: Number(newPrice),
          image: product.image_url || "",
          stock: Number(newStock),
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Product updated successfully ✅");
      fetchProducts();
    } else {
      alert(data.error || data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Cannot connect to backend");
  }
};
  const handleDeleteProduct = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Product deleted successfully ✅");
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <h1>Admin Dashboard 👨‍💻</h1>
          <p>Welcome, {user.name}</p>
        </div>

        {/* Add Product */}

        <div className="product-form">
          <h2>Add Product</h2>

          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />

            <button type="submit">
              Add Product
            </button>
          </form>
        </div>

        {/* Product List */}

        <div className="admin-products">
          <h2>Manage Products</h2>

          <div className="admin-product-grid">
            {products.map((product) => (
              <div
                className="admin-product-card"
                key={product.id}
              >
                <img
                  src={
                    product.image_url ||
                    "https://placehold.co/300x200?text=Product"
                  }
                  alt={product.name}
                />

                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <strong>₹{product.price}</strong>

                <p>Stock: {product.stock}</p>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDeleteProduct(product.id)
                  }
                >
                  Delete 🗑️
                </button>
                <button
  className="edit-btn"
  onClick={() => handleEditProduct(product)}
>
  Edit ✏️
</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;