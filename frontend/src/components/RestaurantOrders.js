import React, { useState, useEffect } from 'react';
import './RestaurantOrders.css';

function RestaurantOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders
    fetch('http://localhost:5005/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Error fetching orders:', err));
  }, []);

  return (
    <div className="container">
      <h2>Order from Restaurant</h2>
      <ul>
        {orders.map(order => (
          <li key={order.OrderID}>{order.MenuItemID} - ${order.TotalCost}</li>
        ))}
      </ul>
    </div>
  );
}

export default RestaurantOrders;