import React, { useState, useEffect } from 'react';
import './RoomBooking.css';

function RoomBooking() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch rooms
    fetch('http://localhost:5005/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error('Error fetching rooms:', err));
  }, []);

  return (
    <div className="container">
      <h2>Book a Room</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.RoomID}>{room.RoomType} - ${room.PricePerNight}</li>
        ))}
      </ul>
    </div>
  );
}

export default RoomBooking;