import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  image_url?: string;
  stock: number;
}

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => {
        const foundProduct = data.find(
          (item: Product) => item.id === Number(id)
        );

        setProduct(foundProduct || null);
      })
      .catch((error) =>
        console.error("Product details error:", error)
      );
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const alreadyAdded = cart.find(
      (item: Product) => item.id === product.id
    );

    if (alreadyAdded) {
      alert("Product already in cart");
      return;
    }

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart 🛒");
  };

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <img
        src={
          product.image_url ||
          product.image ||
          "https://placehold.co/500x350?text=Product"
        }
        alt={product.name}
        style={{
          width: "400px",
          maxWidth: "100%",
          borderRadius: "12px",
        }}
      />

      <h1>{product.name}</h1>

      <p>{product.description}</p>

      <h2>₹{product.price}</h2>

      <p>Stock: {product.stock}</p>

      <button onClick={addToCart}>
        Add to Cart 🛒
      </button>
    </div>
  );
}

export default ProductDetails;