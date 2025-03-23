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

app.listen(5005, () => console.log('Server running on port 5005'));
