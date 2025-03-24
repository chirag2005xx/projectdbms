import React, { useState, useEffect } from 'react';
import './StakeholderDashboard.css';

function StakeholderDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Fetch overall stats
    fetch('http://localhost:5005/overall-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching overall stats:', err));
  }, []);

  return (
    <div className="container">
      <h2>Stakeholder Dashboard</h2>
      <p>Total Branches: {stats.totalBranches}</p>
      <p>Total Rooms: {stats.totalRooms}</p>
      <p>Total Occupied Rooms: {stats.totalOccupiedRooms}</p>
      <p>Total Orders: {stats.totalOrders}</p>
      <p>Total Revenue: ${stats.totalRevenue}</p>
    </div>
  );
}

export default StakeholderDashboard;