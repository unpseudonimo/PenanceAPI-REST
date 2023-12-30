const express = require('express');
const router = express.Router();
const connection = require('../db');

/*
    Table sliders
    CREATE TABLE sliders (
    idS INT PRIMARY KEY,
    phrase VARCHAR(255) NOT NULL,
		details VARCHAR(255),
    author VARCHAR(255),
    publication_date DATE
    );
    ALTER TABLE sliders
    ADD COLUMN noEmployee INT,
    ADD FOREIGN KEY (noEmployee) REFERENCES admins(noEmployee);
*/

// Create a new slider
router.post('/createSlider', (req, res) => {
    const { phrase, details, author, publication_date, noEmployee } = req.body;

    // get last idS
    const query = `SELECT MAX(idS) AS idS FROM sliders`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        const idS = result[0].idS + 1;
        const query = `INSERT INTO sliders (idS, phrase, details, author, publication_date, noEmployee) VALUES (${idS}, '${phrase}', '${details}', '${author}', '${publication_date}', ${noEmployee})`;
        connection.query(query, (err, result) => {
            if (err) throw err;
            res.status(200).send('Slider created');
        });
    });
});

// Update a slider
router.put('/updateSlider/:idS', (req, res) => {
    const { idS } = req.params;
    const { phrase, details, author, publication_date, noEmployee } = req.body;
    const query = `UPDATE sliders SET phrase='${phrase}', details='${details}', author='${author}', publication_date='${publication_date}', noEmployee=${noEmployee} WHERE idS=${idS}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).send('Slider updated');
    });
});

// Delete a slider
router.delete('/deleteSlider/:idS', (req, res) => {
    const { idS } = req.params;
    const query = `DELETE FROM sliders WHERE idS=${idS}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).send('Slider deleted');
    });
});

// Get all sliders
router.get('/getSliders', (req, res) => {
    const query = `SELECT * FROM sliders`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving sliders');
        }
        res.send(result);
    });
});

// Get a slider by ID
router.get('/getSlider/:idS', (req, res) => {
    const { idS } = req.params;
    const query = `SELECT * FROM sliders WHERE idS=${idS}`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving slider');
        }
        res.send(result);
    });
});

module.exports = router;