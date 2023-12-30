const express = require('express');
const router = express.Router();
const connection = require('../db');

// Create a new user
router.post('/createUser', (req, res) => {
    // noStudent is ID in table admins
    const { noStudent, name, email, password } = req.body;
    // verify if noEmployee is already in use
    const query = `SELECT * FROM users WHERE noStudent=${noStudent}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.status(500).send('ID already in use');
        } else {
            const query = `INSERT INTO users (noStudent, name, email, password) VALUES ('${noStudent}', '${name}', '${email}', '${password}')`;
            connection.query(query, (err, result) => {
                if (err) throw err;
                res.status(200).send('User created');
            });
        }
    });
});

// Update an user
router.put('/updateUser/:noStudent', (req, res) => {
    const { noStudent } = req.params;
    const { name, email, password } = req.body;
    const query = `UPDATE users SET name='${name}', email='${email}', password='${password}' WHERE noStudent=${noStudent}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).send('User updated');
    });
});

// Delete an user
router.delete('/deleteUser/:noStudent', (req, res) => {
    const { noStudent } = req.params;
    const query = `DELETE FROM users WHERE noStudent=${noStudent}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).send('User deleted');
    });
});

// Get all users
router.get('/getUsers', (req, res) => {
    const query = `SELECT * FROM users`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving users');
        }
        res.send(result);
    })
});

// Get an user by ID
router.get('/getUser/:noStudent', (req, res) => {
    const { noStudent } = req.params;
    const query = `SELECT * FROM users WHERE noStudent=${noStudent}`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving user');
        }
        res.send(result);
    })
});

// Login with noStudent and password
router.post('/login', (req, res) => {
    const { noStudent, password } = req.body;
    const query = `SELECT * FROM admins WHERE noEmployee='${noStudent}' AND password='${password}'`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.status(200).send('Login successful');
        } else {
            res.status(500).send('Wrong credentials');
        }
    });
});

module.exports = router;