import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './GuestDashboard.css';

function GuestDashboard() {
  const [rooms, setRooms] = useState([]);
  const [orders, setOrders] = useState([]);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    // Fetch rooms
    fetch('http://localhost:5005/rooms')
      .then(res => res.json())
      .then(data => {
        console.log('Rooms:', data); // Debugging log
        setRooms(data);
      })
      .catch(err => console.error('Error fetching rooms:', err));

    // Fetch orders
    fetch('http://localhost:5005/orders')
      .then(res => res.json())
      .then(data => {
        console.log('Orders:', data); // Debugging log
        setOrders(data);
      })
      .catch(err => console.error('Error fetching orders:', err));

    // Fetch facilities
    fetch('http://localhost:5005/facilities')
      .then(res => res.json())
      .then(data => {
        console.log('Facilities:', data); // Debugging log
        setFacilities(data);
      })
      .catch(err => console.error('Error fetching facilities:', err));
  }, []);

  return (
    <div className="container">
      <h2>Guest Dashboard</h2>
      <h3>Book a Room</h3>
      <ul>
        {Array.isArray(rooms) && rooms.map(room => (
          <li key={room.RoomID}>
            <Link to="/room-booking">{room.RoomType} - ${room.PricePerNight}</Link>
          </li>
        ))}
      </ul>
      <h3>Order from Restaurant</h3>
      <ul>
        {Array.isArray(orders) && orders.map(order => (
          <li key={order.OrderID}>
            <Link to="/restaurant-orders">{order.MenuItemID} - ${order.TotalCost}</Link>
          </li>
        ))}
      </ul>
      <h3>Use Pool Facilities</h3>
      <ul>
        {Array.isArray(facilities) && facilities.map(facility => (
          <li key={facility.FacilityID}>
            <Link to="/pool-facilities">{facility.FacilityType} - ${facility.UsageFee}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GuestDashboard;