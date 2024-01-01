const express = require('express');
const router = express.Router();
const connection = require('../db');

// Create a new admin - Code optimized and res.JSON added
router.post('/createAdmin', (req, res) => {
    // noEmployee is ID in table admins
    const { noEmployee, name, email, password } = req.body;
    // verify if noEmployee, name, email or password are empty
    if (!noEmployee || !name || !email || !password) {
        res.status(400).json({ message: '2' }); // One or more fields are empty
    } else {
        // verify if noEmployee is already in use
        const query = `SELECT * FROM admins WHERE noEmployee=${noEmployee}`;
        connection.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: '0' }); // Error retrieving admins
            }
            if (result.length > 0) {
                res.status(403).json({ message: '2' }); //ID already in use'
            } else {
                const query = `INSERT INTO admins (noEmployee, name, email, password) VALUES ('${noEmployee}', '${name}', '${email}', '${password}')`;
                connection.query(query, (err, result) => {
                    if (err) {
                        res.status(500).json({ message: '0' }); // Error creating admin
                    }
                    res.status(200).json({ message: '1' }); // Admin created
                });
            }
        });
    }
});


/*
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
*/

// Update an admin - Code optimized and res.JSON added
router.put('/updateAdmin/:noEmployee', (req, res) => {
    const { noEmployee } = req.params;
    const { name, email, password } = req.body;
    const query = `UPDATE admins SET name='${name}', email='${email}', password='${password}' WHERE noEmployee=${noEmployee}`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error updating admin
        }
        res.status(200).json({ message: '1' }); // Admin updated
    });
});

/*
router.put('/updateAdmin/:noEmployee', (req, res) => {
    const { noEmployee } = req.params;
    const { name, email, password } = req.body;
    const query = `UPDATE admins SET name='${name}', email='${email}', password='${password}' WHERE noEmployee=${noEmployee}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).send('Admin updated');
    });
});
*/

// Delete an admin - Code optimized and res.JSON added
router.delete('/deleteAdmin/:noEmployee', (req, res) => {
    const { noEmployee } = req.params;
    // verify if noEmployee are empty
    if (!noEmployee) {
        res.status(400).json({ message: '2' }); // One or more fields are empty
    } else {
        const query = `DELETE FROM admins WHERE noEmployee=${noEmployee}`;
        connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error deleting admin
        }
        res.status(200).json({ message: '1' }); // Admin deleted
        });        
    }
});

/*
router.delete('/deleteAdmin/:noEmployee', (req, res) => {
    const { noEmployee } = req.params;
    const query = `DELETE FROM admins WHERE noEmployee=${noEmployee}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).send('Admin deleted');
    });
});
*/

// Get all admins
router.get('/getAdmins', (req, res) => {
    const query = `SELECT * FROM admins`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error retrieving admins
        }
        res.status(200).json(result); // Admins retrieved
    });
});

// Get an admin by ID
router.get('/getAdmin/:noEmployee', (req, res) => {
    const { noEmployee } = req.params;
    const query = `SELECT * FROM admins WHERE noEmployee=${noEmployee}`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error retrieving admin
        }
        res.status(200).json(result); // Admin retrieved
    });
});

// Login with noEmployee and password - Code optimized and res.JSON added
router.post('/login', (req, res) => {
    const { noEmployee, password } = req.body;
    // verify if noEmployee or password are empty
    if (!noEmployee || !password) {
        res.status(400).json({ message: '2' }); // One or more fields are empty
    } else {
        const query = `SELECT * FROM admins WHERE noEmployee='${noEmployee}' AND password='${password}'`;
        connection.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: '0' }); // Error retrieving admin
            }
            if (result.length > 0) {
                res.status(200).json({ message: '1' }); // Login successful
            } else {
                res.status(403).json({ message: '3' }); // Wrong credentials
            }
        });
    }
});

/*
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
*/

module.exports = router;