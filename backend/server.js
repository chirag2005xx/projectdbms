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
app.get('/db-check', async (req, res) => {
    try {
        const [result] = await db.query('SELECT 1');
        res.send('Database connected successfully!');
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).send('Database NOT connected');
    }
});

app.get('/test', async (req, res) => {
    try {
        const [result] = await db.query('SELECT NOW() AS currentTime');
        res.json({ message: 'Connected to MySQL!', serverTime: result[0].currentTime });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to fetch rooms
app.get('/rooms', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Room');
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to fetch orders
app.get('/orders', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM RestaurantOrder');
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to fetch facilities
app.get('/facilities', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Facility');
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to fetch branch stats
app.get('/branch-stats', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Branch');
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to fetch overall stats
app.get('/overall-stats', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM Branch) AS totalBranches,
                (SELECT COUNT(*) FROM Room) AS totalRooms,
                (SELECT COUNT(*) FROM Room WHERE AvailabilityStatus = 0) AS totalOccupiedRooms,
                (SELECT COUNT(*) FROM RestaurantOrder) AS totalOrders,
                (SELECT SUM(TotalCost) FROM Booking) AS totalRevenue
        `);
        res.json(result[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.listen(5005, () => console.log('Server running on port 5005'));
