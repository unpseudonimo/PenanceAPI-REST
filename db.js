const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'prueba'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected!');
});

module.exports = connection;