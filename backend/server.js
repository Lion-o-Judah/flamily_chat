const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MySQL connection
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'chat_app'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('chat message', (msg) => {
        // Save message to MySQL
        db.query('INSERT INTO messages (content) VALUES (?)', [msg], (err, result) => {
            if (err) throw err;
            console.log('Message saved to database');
        });

        // Emit message to all connected clients
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
