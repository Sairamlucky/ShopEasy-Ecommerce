import { useEffect, useState } from "react";
import "./Orders.css";

interface Order {
  id: number;
  total_amount: number;
  status: string;
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return;

    const user = JSON.parse(savedUser);

    fetch(`http://localhost:5000/orders/${user.id}`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Orders error:", error));
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders 📦</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No orders found</h2>
            <p>Your previous orders will appear here.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <span className="order-status">
                    {order.status}
                  </span>
                </div>

                <p className="order-total">
                  Total: ₹{order.total_amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;