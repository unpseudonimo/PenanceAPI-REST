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
router.delete('/delete/:idB', (req, res) => {
    const { idB } = req.params;
    const query = 'SELECT pdf FROM books WHERE idB = ?';
  
    connection.query(query, [idB], (error, results) => {
      if (error) {
        return res.status(500).send({ error });
      }
  
      if (results.length > 0) {
        fs.unlink(results[0].pdf, (err) => {
          if (err) {
            return res.status(500).send({ err });
          }
  
          const deleteQuery = 'DELETE FROM books WHERE idB = ?';
          connection.query(deleteQuery, [idB], (error, results) => {
            if (error) {
              return res.status(500).send({ error });
            }
            res.send({ message: 'Libro eliminado exitosamente' });
          });
        });
      } else {
        res.status(404).send({ message: 'Libro no encontrado' });
      }
    });
  }
);

// download a file pdf
router.get('/download/:idB', (req, res) => {
    const { idB } = req.params;
    const query = 'SELECT pdf FROM books WHERE idB = ?';
  
    connection.query(query, [idB], (error, results) => {
      if (error) {
        return res.status(500).send({ error });
      }
  
      if (results.length > 0) {
        res.download(path.resolve(__dirname, results[0].pdf));
      } else {
        res.status(404).send({ message: 'Libro no encontrado' });
      }
    });
  }
);

// Upload a file
router.post('/upload', upload.single('pdf'), (req, res) => {
    const { title, author, publication_date, isbn, noEmployee } = req.body;
    const pdf = req.file.path;
  
    // Obtén el ID más grande
    connection.query('SELECT MAX(idB) AS maxId FROM books', (error, results) => {
      if (error) {
        return res.status(500).send({ error });
      }
  
      // Incrementa el ID más grande en uno
      const idB = results[0].maxId + 1;
  
      const query = 'INSERT INTO books (idB, title, author, publication_date, isbn, pdf, noEmployee) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
      connection.query(query, [idB, title, author, publication_date, isbn, pdf, noEmployee], (error, results) => {
        if (error) {
          return res.status(500).send({ error });
        }
        res.status(201).send({ message: 'Libro creado exitosamente', bookId: idB });
      });
    });
  }
);

  module.exports = router;