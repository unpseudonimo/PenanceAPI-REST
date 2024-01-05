const express = require('express');
const router = express.Router();
const connection = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const appRoot = require('app-root-path');
const { error } = require('console');

// Configuring multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../docs'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Delete a file
router.delete('/delete/:idH', (req, res) => {
    const { idH } = req.params;
    const query = 'SELECT pdf FROM homework WHERE idH = ?';
  
    connection.query(query, [idH], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error deleting homework
      }
  
      if (results.length > 0) {
        fs.unlink(results[0].pdf, (err) => {
          if (err) {
            return res.status(500).json({ message: '0' }); // Error deleting homework
          }
  
          const deleteQuery = 'DELETE FROM homework WHERE idH = ?';
          connection.query(deleteQuery, [idH], (error, results) => {
            if (error) {
              return res.status(500).send({ message: '0' }); // Error deleting homework
            }
            res.status(200).json({ message: '1' }); // Homework deleted
          });
        });
      } else {
        res.status(404).json({ message: '2' }); // Homework not found
      }
    });
  }
);

// download a file pdf
router.get('/download/:idH', (req, res) => {
    const { idH } = req.params;
    const query = 'SELECT pdf FROM homework WHERE idH = ?';
  
    connection.query(query, [idH], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error downloading homework
      }
  
      if (results.length > 0) {
        res.download(path.resolve(__dirname, results[0].pdf));
      } else {
        res.status(404).send({ message: '2' }); // Homework not found
      }
    });
  }
);

// Get a homework by ID
router.get('/getHomework/:idH', (req, res) => {
    const { idH } = req.params;
    const query = 'SELECT * FROM homework WHERE idH = ?';
  
    connection.query(query, [idH], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error retrieving homework
      }
  
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: '2' }); // Homework not found
      }
    });
  }
);


// Get all homeworks
router.get('/getHomeworks', (req, res) => {
    const query = 'SELECT * FROM homework';
  
    connection.query(query, (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error retrieving homeworks
      }
      res.status(200).json(results);
    });
  }
);

// Upload a file

router.post('/upload', upload.single('pdf'), (req, res) => {
    const { title, description, publication_date, noEmployee } = req.body;
    const pdf = req.file.path;
  
    // Obtén el ID más grande
    connection.query('SELECT MAX(idH) AS maxId FROM homework', (error, results) => {
      if (error) {
        return res.status(400).json({ message: '0' }); // Error creating homework
      }
      // Incrementa el ID más grande en uno
      const idH = results[0].maxId + 1;
      // Verify if title or description are empty
      if (!title || !description) {
        res.status(400).json({ message: '2' }); // One or more fields are empty
      } else {
        const query = 'INSERT INTO homework (idH, title, description, publication_date, pdf, noEmployee) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, [idH, title, description, publication_date, pdf, noEmployee], (error, results) => {
          if (error) {
            return res.status(500).json({ message: '0' }); // Error creating homework
          }
          res.status(201).json({ message: '1' }); // Homework created
        });
      }
    });
  }
);

  module.exports = router;