import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PoolFacilities.css';

function PoolFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [usageStartTime, setUsageStartTime] = useState('');
  const [usageEndTime, setUsageEndTime] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch facilities
    fetch('http://localhost:5005/facilities')
      .then(res => res.json())
      .then(data => setFacilities(data))
      .catch(err => console.error('Error fetching facilities:', err));
  }, []);

  const handleUsage = async () => {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) {
      alert('Please log in to use a facility');
      return;
    }

    try {
      const response = await fetch('http://localhost:5005/use-facility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestId, facilityId: selectedFacility.FacilityID, usageStartTime, usageEndTime, totalCost }),
      });
      const data = await response.json();
      if (data.usageId) {
        alert('Facility usage recorded successfully');
        navigate('/guest'); // Redirect to the guest dashboard after using a facility
      } else {
        alert('Failed to record facility usage');
      }
    } catch (err) {
      console.error('Error during facility usage:', err);
      alert('An error occurred during facility usage');
    }
  };

  useEffect(() => {
    if (selectedFacility && usageStartTime && usageEndTime) {
      const start = new Date(usageStartTime);
      const end = new Date(usageEndTime);
      const hours = (end - start) / (1000 * 60 * 60);
      if (hours > 0) {
        setTotalCost(hours * selectedFacility.UsageFee);
      } else {
        setTotalCost(0);
      }
    }
  }, [selectedFacility, usageStartTime, usageEndTime]);

  return (
    <div className="container">
      <h2>Use Pool Facilities</h2>
      <ul>
        {facilities.map(facility => (
          <li key={facility.FacilityID} onClick={() => setSelectedFacility(facility)}>
            {facility.FacilityType} - ${facility.UsageFee}/hour
          </li>
        ))}
      </ul>
      {selectedFacility && (
        <>
          <h3>Selected Facility: {selectedFacility.FacilityType}</h3>
          <input
            type="datetime-local"
            value={usageStartTime}
            onChange={(e) => setUsageStartTime(e.target.value)}
          />
          <input
            type="datetime-local"
            value={usageEndTime}
            onChange={(e) => setUsageEndTime(e.target.value)}
          />
          <p>Total Cost: ${totalCost}</p>
          <button onClick={handleUsage}>Use Facility</button>
        </>
      )}
    </div>
  );
}

export default PoolFacilities;