const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import database connection

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Express server is running');
});

// Check if database is connected
app.get('/db-check', (req, res) => {
    db.ping(err => {
        if (err) {
            return res.status(500).send('Database NOT connected');
        }
        res.send('Database connected successfully!');
    });
});

app.get('/test', (req, res) => {
    db.query('SELECT NOW() AS currentTime', (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Connected to MySQL!', serverTime: result[0].currentTime });
    });
});

// Endpoint to fetch rooms
app.get('/rooms', async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM Room"); 
      res.json(rows);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database connection failed" });
    }
  });
  

// Endpoint to fetch orders
app.get('/orders', (req, res) => {
    db.query('SELECT * FROM RestaurantOrder', (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Endpoint to fetch facilities
app.get('/facilities', (req, res) => {
    db.query('SELECT * FROM Facility', (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Endpoint to fetch branch stats
app.get('/branch-stats', (req, res) => {
    db.query('SELECT * FROM Branch', (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Endpoint to fetch overall stats
app.get('/overall-stats', (req, res) => {
    db.query('SELECT * FROM (SELECT COUNT(*) AS totalBranches FROM Branch) AS BranchStats, (SELECT COUNT(*) AS totalRooms FROM Room) AS RoomStats, (SELECT COUNT(*) AS totalOccupiedRooms FROM Room WHERE AvailabilityStatus = 0) AS OccupiedRoomStats, (SELECT COUNT(*) AS totalOrders FROM RestaurantOrder) AS OrderStats, (SELECT SUM(TotalCost) AS totalRevenue FROM Booking) AS RevenueStats', (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

app.listen(5005, () => console.log('Server running on port 5005'));