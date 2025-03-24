import React, { useState, useEffect } from 'react';
import './BranchDashboard.css';

function BranchDashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Fetch branch stats
    fetch('http://localhost:5005/branch-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching branch stats:', err));
  }, []);

  return (
    <div className="container">
      <h2>Branch Dashboard</h2>
      {stats.map(branch => (
        <div key={branch.BranchID}>
          <p>Branch Name: {branch.BranchName}</p>
          <p>Location: {branch.Location}</p>
          <p>Contact Number: {branch.ContactNumber}</p>
        </div>
      ))}
    </div>
  );
}

export default BranchDashboard;