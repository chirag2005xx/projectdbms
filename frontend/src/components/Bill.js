import React, { useState, useEffect } from 'react';
import './Bill.css';

function Bill() {
  const [billDetails, setBillDetails] = useState({ bookings: [], orders: [], usages: [] });
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) {
      alert('Please log in to view the bill');
      return;
    }

    // Fetch bill details
    fetch(`http://localhost:5005/bill/${guestId}`)
      .then(res => res.json())
      .then(data => {
        setBillDetails(data);
        const total = data.bookings.reduce((sum, booking) => sum + (booking.TotalCost || 0), 0) +
                      data.orders.reduce((sum, order) => sum + (order.TotalCost || 0), 0) +
                      data.usages.reduce((sum, usage) => sum + (usage.TotalCost || 0), 0);
        setTotalAmount(total);
      })
      .catch(err => console.error('Error fetching bill details:', err));
  }, []);

  return (
    <div className="container">
      <h2>Bill Details</h2>
      <h3>Bookings</h3>
      <ul>
        {billDetails.bookings.map(booking => (
          <li key={booking.BookingID}>
            Room ID: {booking.RoomID}, Check-In: {new Date(booking.CheckInDate).toLocaleDateString()}, Check-Out: {new Date(booking.CheckOutDate).toLocaleDateString()}, Total Cost: ${booking.TotalCost}
          </li>
        ))}
      </ul>
      <h3>Restaurant Orders</h3>
      <ul>
        {billDetails.orders.map(order => (
          <li key={order.OrderID}>
            Menu Item ID: {order.MenuItemID}, Order Date: {new Date(order.OrderDate).toLocaleDateString()}, Total Cost: ${order.TotalCost}
          </li>
        ))}
      </ul>
      <h3>Facility Usages</h3>
      <ul>
        {billDetails.usages.map(usage => (
          <li key={usage.UsageID}>
            Facility ID: {usage.FacilityID}, Start Time: {new Date(usage.UsageStartTime).toLocaleString()}, End Time: {new Date(usage.UsageEndTime).toLocaleString()}, Total Cost: ${usage.TotalCost}
          </li>
        ))}
      </ul>
      <h3>Total Amount: ${totalAmount}</h3>
    </div>
  );
}

export default Bill;