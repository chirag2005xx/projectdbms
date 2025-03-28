import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import GuestDashboard from './components/GuestDashboard';
import BranchDashboard from './components/BranchDashboard';
import StakeholderDashboard from './components/StakeholderDashboard';
import RoomBooking from './components/RoomBooking';
import RestaurantOrders from './components/RestaurantOrders';
import PoolFacilities from './components/PoolFacilities';
import Bill from './components/Bill';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/guest" element={<GuestDashboard />} />
        <Route path="/branch" element={<BranchDashboard />} />
        <Route path="/stakeholder" element={<StakeholderDashboard />} />
        <Route path="/room-booking/:roomId" element={<RoomBooking />} />
        <Route path="/restaurant-orders" element={<RestaurantOrders />} />
        <Route path="/pool-facilities" element={<PoolFacilities />} />
        <Route path="/bill" element={<Bill />} />
      </Routes>
    </Router>
  );
}

export default App;