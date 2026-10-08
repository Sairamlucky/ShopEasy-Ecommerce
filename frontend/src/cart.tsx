import { useEffect, useState } from "react";
import "./Cart.css";

interface CartProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
  quantity: number;
}

function Cart() {
  const [cart, setCart] = useState<CartProduct[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      const products = JSON.parse(savedCart);

      const cartWithQuantity = products.map(
        (product: CartProduct) => ({
          ...product,
          quantity: product.quantity || 1,
        })
      );

      setCart(cartWithQuantity);
    }
  }, []);

  const updateCart = (updatedCart: CartProduct[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id: number) => {
    const updatedCart = cart.map((product) =>
      product.id === id
        ? {
            ...product,
            quantity: product.quantity + 1,
          }
        : product
    );

    updateCart(updatedCart);
  };

  const decreaseQuantity = (id: number) => {
    const updatedCart = cart
      .map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: product.quantity - 1,
            }
          : product
      )
      .filter((product) => product.quantity > 0);

    updateCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, product) =>
      sum + Number(product.price) * product.quantity,
    0
  );

  const handleCheckout = async () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Please login first");
      return;
    }

    const user = JSON.parse(savedUser);

    try {
      const response = await fetch(
        "http://localhost:5000/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            totalAmount: total,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          `Order placed successfully! Order ID: ${data.orderId}`
        );

        localStorage.removeItem("cart");
        setCart([]);
      } else {
        alert(data.message || "Order failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Cannot connect to backend");
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Shopping Cart 🛒</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to continue shopping.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((product) => (
                <div className="cart-item" key={product.id}>
                  <img
                    src={
                      product.image_url ||
                      product.image ||
                      "https://placehold.co/300x200?text=Product"
                    }
                    alt={product.name}
                  />

                  <div className="cart-info">
                    <h3>{product.name}</h3>

                    <p className="cart-price">
                      ₹{product.price}
                    </p>

                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          decreaseQuantity(product.id)
                        }
                      >
                        −
                      </button>

                      <span>{product.quantity}</span>

                      <button
                        onClick={() =>
                          increaseQuantity(product.id)
                        }
                      >
                        +
                      </button>
                    </div>

                    <p className="subtotal">
                      Subtotal: ₹
                      {Number(product.price) *
                        product.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Total: ₹{total}</h2>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;

