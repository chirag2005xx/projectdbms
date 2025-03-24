import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RoomBooking.css';

function RoomBooking() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    // Fetch room details
    fetch(`http://localhost:5005/rooms/${roomId}`)
      .then(res => res.json())
      .then(data => setRoom(data))
      .catch(err => console.error('Error fetching room details:', err));
  }, [roomId]);

  const handleBooking = async () => {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) {
      alert('Please log in to book a room');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      alert('Please select both check-in and check-out dates');
      return;
    }

    try {
      const response = await fetch('http://localhost:5005/book-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestId, roomId, checkInDate, checkOutDate, totalCost }),
      });
      const data = await response.json();
      if (data.bookingId) {
        alert('Room booked successfully');
        navigate('/guest'); // Redirect to the guest dashboard after successful booking
      } else {
        alert('Failed to book room');
      }
    } catch (err) {
      console.error('Error during booking:', err);
      alert('An error occurred during booking');
    }
  };

  useEffect(() => {
    if (room && checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const days = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
      if (days > 0) {
        setTotalCost(days * room.PricePerNight);
      } else {
        setTotalCost(0);
      }
    }
  }, [room, checkInDate, checkOutDate]);

  return (
    <div className="container">
      {room && (
        <>
          <h2>Book Room: {room.RoomType}</h2>
          <p>Price per Night: ${room.PricePerNight}</p>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
          />
          <p>Total Cost: ${totalCost}</p>
          <button onClick={handleBooking}>Book Room</button>
        </>
      )}
    </div>
  );
}

export default RoomBooking;