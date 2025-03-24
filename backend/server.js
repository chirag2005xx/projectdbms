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

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM Guest WHERE Email = ? AND Password = ?', [username, password]);
        if (rows.length > 0) {
            res.json({ success: true, guestId: rows[0].GuestID });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to fetch branches
app.get('/branches', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Branch');
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to fetch rooms by branch
app.get('/rooms/:branchId', async (req, res) => {
    const { branchId } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Room WHERE BranchID = ? AND AvailabilityStatus = 1', [branchId]);
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to create a booking
app.post('/book-room', async (req, res) => {
    const { guestId, roomId, checkInDate, checkOutDate, totalCost } = req.body;
    try {
        const [result] = await db.query('INSERT INTO Booking (GuestID, RoomID, CheckInDate, CheckOutDate, TotalCost, BookingStatus) VALUES (?, ?, ?, ?, ?, ?)', [guestId, roomId, checkInDate, checkOutDate, totalCost, 'Confirmed']);
        await db.query('UPDATE Room SET AvailabilityStatus = 0 WHERE RoomID = ?', [roomId]);
        res.json({ bookingId: result.insertId });
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

// Endpoint to fetch menu items
app.get('/menu-items', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM MenuItem');
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to place a restaurant order
app.post('/place-order', async (req, res) => {
    const { guestId, menuItemId, orderDate, totalCost } = req.body;
    try {
        const [result] = await db.query('INSERT INTO RestaurantOrder (GuestID, MenuItemID, OrderDate, TotalCost) VALUES (?, ?, ?, ?)', [guestId, menuItemId, orderDate, totalCost]);
        res.json({ orderId: result.insertId });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to use a facility
app.post('/use-facility', async (req, res) => {
    const { guestId, facilityId, usageStartTime, usageEndTime, totalCost } = req.body;
    try {
        const [result] = await db.query('INSERT INTO FacilityUsage (GuestID, FacilityID, UsageStartTime, UsageEndTime, TotalCost) VALUES (?, ?, ?, ?, ?)', [guestId, facilityId, usageStartTime, usageEndTime, totalCost]);
        res.json({ usageId: result.insertId });
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

// Endpoint to fetch bill details for a guest
app.get('/bill/:guestId', async (req, res) => {
    const { guestId } = req.params;
    try {
        const [bookings] = await db.query('SELECT * FROM Booking WHERE GuestID = ?', [guestId]);
        const [orders] = await db.query('SELECT * FROM RestaurantOrder WHERE GuestID = ?', [guestId]);
        const [usages] = await db.query('SELECT * FROM FacilityUsage WHERE GuestID = ?', [guestId]);
        res.json({ bookings, orders, usages });
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

// Function to test database connection
async function testDB() {
  try {
    const connection = await db.getConnection();
    console.log('Connected to MySQL database.');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

// Test the database connection when the server starts
testDB();

app.listen(5005, () => console.log('Server running on port 5005'));