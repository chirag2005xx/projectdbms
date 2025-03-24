import React, { useState, useEffect } from 'react';
import './RestaurantOrders.css';

function RestaurantOrders() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    // Fetch menu items
    fetch('http://localhost:5005/menu-items')
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error('Error fetching menu items:', err));
  }, []);

  const handleOrder = async () => {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) {
      alert('Please log in to place an order');
      return;
    }

    try {
      const response = await fetch('http://localhost:5005/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestId, menuItemId: selectedItem.MenuItemID, orderDate: new Date().toISOString().split('T')[0], totalCost }),
      });
      const data = await response.json();
      if (data.orderId) {
        alert('Order placed successfully');
      } else {
        alert('Failed to place order');
      }
    } catch (err) {
      console.error('Error during order placement:', err);
      alert('An error occurred during order placement');
    }
  };

  return (
    <div className="container">
      <h2>Order from Restaurant</h2>
      <ul>
        {menuItems.map(item => (
          <li key={item.MenuItemID} onClick={() => { setSelectedItem(item); setTotalCost(item.Price); }}>
            {item.ItemName} - ${item.Price}
          </li>
        ))}
      </ul>
      {selectedItem && (
        <>
          <h3>Selected Item: {selectedItem.ItemName}</h3>
          <p>Total Cost: ${totalCost}</p>
          <button onClick={handleOrder}>Place Order</button>
        </>
      )}
    </div>
  );
}

export default RestaurantOrders;