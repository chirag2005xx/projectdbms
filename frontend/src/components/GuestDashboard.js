import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './GuestDashboard.css';

function GuestDashboard() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch branches
    fetch('http://localhost:5005/branches')
      .then(res => res.json())
      .then(data => setBranches(data))
      .catch(err => console.error('Error fetching branches:', err));
  }, []);

  const handleBranchSelect = (branchId) => {
    setSelectedBranch(branchId);
    // Fetch rooms for the selected branch
    fetch(`http://localhost:5005/rooms/${branchId}`)
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error('Error fetching rooms:', err));
  };

  return (
    <div className="container">
      <h2>Guest Dashboard</h2>
      <h3>Select a Branch</h3>
      <ul>
        {branches.map(branch => (
          <li key={branch.BranchID} onClick={() => handleBranchSelect(branch.BranchID)}>
            {branch.BranchName} - {branch.Location}
          </li>
        ))}
      </ul>
      {selectedBranch && (
        <>
          <h3>Book a Room</h3>
          <ul>
            {rooms.map(room => (
              <li key={room.RoomID}>
                <Link to={`/room-booking/${room.RoomID}`}>{room.RoomType} - ${room.PricePerNight}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default GuestDashboard;