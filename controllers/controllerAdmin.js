const express = require('express');
const router = express.Router();
const connection = require('../db');

// Create a new admin
router.post('/createAdmin', (req, res) => {
    // noEmployee is ID in table admins
    const { noEmployee, name, email, password } = req.body;
    // verify if noEmployee is already in use
    const query = `SELECT * FROM admins WHERE noEmployee=${noEmployee}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.status(500).send('ID already in use');
        } else {
            const query = `INSERT INTO admins (noEmployee, name, email, password) VALUES ('${noEmployee}', '${name}', '${email}', '${password}')`;
            connection.query(query, (err, result) => {
                if (err) throw err;
                res.status(200).send('Admin created');
            });
        }
    });
});

// Update an admin
router.put('/updateAdmin/:noEmployee', (req, res) => {
    const { noEmployee } = req.params;
    const { name, email, password } = req.body;
    const query = `UPDATE admins SET name='${name}', email='${email}', password='${password}' WHERE noEmployee=${noEmployee}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).send('Admin updated');
    });
});

// Delete an admin
router.delete('/deleteAdmin/:noEmployee', (req, res) => {
    const { noEmployee } = req.params;
    const query = `DELETE FROM admins WHERE noEmployee=${noEmployee}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).send('Admin deleted');
    });
});

// Get all admins
router.get('/getAdmins', (req, res) => {
    const query = `SELECT * FROM admins`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving admins');
        }
        res.send(result);
    });
});

// Get an admin by ID
router.get('/getAdmin/:noEmployee', (req, res) => {
    const { noEmployee } = req.params;
    const query = `SELECT * FROM admins WHERE noEmployee=${noEmployee}`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving admin');
        }
        res.send(result);
    });
});

// Login with noEmployee and password
router.post('/login', (req, res) => {
    const { noEmployee, password } = req.body;
    const query = `SELECT * FROM admins WHERE noEmployee='${noEmployee}' AND password='${password}'`;
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