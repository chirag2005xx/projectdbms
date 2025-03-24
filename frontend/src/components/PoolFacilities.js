import React, { useState, useEffect } from 'react';
import './PoolFacilities.css';

function PoolFacilities() {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    // Fetch facilities
    fetch('http://localhost:5005/facilities')
      .then(res => res.json())
      .then(data => setFacilities(data))
      .catch(err => console.error('Error fetching facilities:', err));
  }, []);

  return (
    <div className="container">
      <h2>Use Pool Facilities</h2>
      <ul>
        {facilities.map(facility => (
          <li key={facility.FacilityID}>{facility.FacilityType} - ${facility.UsageFee}</li>
        ))}
      </ul>
    </div>
  );
}

export default PoolFacilities;