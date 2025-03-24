const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'student',  // Replace with your MySQL password
    database: 'HotelManagement',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check connection once when server starts
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database.');
        connection.release();  // Release connection back to the pool
    } catch (err) {
        console.error('Database connection failed:', err);
    }
})();

module.exports = pool;
