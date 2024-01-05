const express = require("express");
const router = express.Router();
const connection = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const appRoot = require("app-root-path");
const { error } = require("console");

// Configuring multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../docs"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Obtener la lista de libros para estudiantes
router.get("/api/books", (req, res) => {
  connection.query("SELECT idB, title, author FROM books", (error, results) => {
    if (error) {
      console.error("Error fetching books:", error);
      return res.status(500).send({ error });
    }
    console.log("Books fetched successfully:", results);
    res.status(200).send(results);
  });
});

// Obtener detalles de un libro específico para estudiantes
router.get("/api/books/:idB", (req, res) => {
  const { idB } = req.params;
  const query =
    "SELECT idB, title, author, publication_date, isbn FROM books WHERE idB = ?";

  connection.query(query, [idB], (error, results) => {
    if (error) {
      console.error("Error fetching book details:", error);
      return res.status(500).send({ error });
    }

    if (results.length > 0) {
      console.log("Book details fetched successfully:", results[0]);
      res.status(200).send(results[0]);
    } else {
      console.log("Book not found");
      res.status(404).send({ message: "Libro no encontrado" });
    }
  });
});

// Descargar un libro para estudiantes
router.get("/api/books/download/:idB", (req, res) => {
  const { idB } = req.params;
  const query = "SELECT pdf FROM books WHERE idB = ?";

  connection.query(query, [idB], (error, results) => {
    if (error) {
      console.error("Error fetching book for download:", error);
      return res.status(500).send({ error });
    }

    if (results.length > 0) {
      console.log("Book for download found:", results[0]);
      res.download(path.resolve(__dirname, results[0].pdf));
    } else {
      console.log("Book not found for download");
      res.status(404).send({ message: "Libro no encontrado" });
    }
  });
});

// Obtener la lista de libros para el administrador
router.get("/api/admin/books", (req, res) => {
  connection.query("SELECT * FROM books", (error, results) => {
    if (error) {
      console.error("Error fetching admin books:", error);
      return res.status(500).send({ error });
    }
    console.log("Admin books fetched successfully:", results);
    res.status(200).send(results);
  });
});

// Actualizar un libro para el administrador
router.put("/api/admin/books/update/:idB", (req, res) => {
  const { idB } = req.params;
  const { title, author, publication_date, isbn, noEmployee } = req.body;

  const updateQuery =
    "UPDATE books SET title = ?, author = ?, publication_date = ?, isbn = ?, noEmployee = ? WHERE idB = ?";

  connection.query(
    updateQuery,
    [title, author, publication_date, isbn, noEmployee, idB],
    (error, results) => {
      if (error) {
        console.error("Error updating book:", error);
        return res.status(500).send({ error });
      }

      if (results.affectedRows > 0) {
        console.log("Book updated successfully");
        res.status(200).send({ message: "Libro actualizado exitosamente" });
      } else {
        console.log("Book not found for update");
        res.status(404).send({ message: "Libro no encontrado" });
      }
    }
  );
});

// Eliminar un libro y su archivo asociado para el administrador
router.delete("/api/admin/books/delete/:idB", (req, res) => {
  const { idB } = req.params;
  const selectQuery = "SELECT pdf FROM books WHERE idB = ?";

  connection.query(selectQuery, [idB], (error, results) => {
    if (error) {
      console.error("Error fetching book for deletion:", error);
      return res.status(500).send({ error });
    }

    if (results.length > 0) {
      const pdfPath = results[0].pdf;
      fs.unlink(pdfPath, (err) => {
        if (err) {
          console.error("Error deleting book file:", err);
          return res.status(500).send({ err });
        }

        const deleteQuery = "DELETE FROM books WHERE idB = ?";
        connection.query(deleteQuery, [idB], (error, results) => {
          if (error) {
            console.error("Error deleting book:", error);
            return res.status(500).send({ error });
          }

          if (results.affectedRows > 0) {
            console.log("Book deleted successfully");
            res.status(200).send({ message: "Libro eliminado exitosamente" });
          } else {
            console.log("Book not found for deletion");
            res.status(404).send({ message: "Libro no encontrado" });
          }
        });
      });
    } else {
      console.log("Book not found for deletion");
      res.status(404).send({ message: "Libro no encontrado" });
    }
  });
});

// Subir un nuevo libro para el administrador
router.post("/api/admin/books/upload", upload.single("pdf"), (req, res) => {
  const { title, author, publication_date, isbn, noEmployee } = req.body;
  const pdf = req.file.path;

  const insertQuery =
    "INSERT INTO books (title, author, publication_date, isbn, pdf, noEmployee) VALUES (?, ?, ?, ?, ?, ?)";

  connection.query(
    insertQuery,
    [title, author, publication_date, isbn, pdf, noEmployee],
    (error, results) => {
      if (error) {
        console.error("Error uploading book:", error);
        return res.status(500).send({ error });
      }

      console.log("Book uploaded successfully:", results);
      res.status(201).send({
        message: "Libro creado exitosamente",
        bookId: results.insertId,
      });
    }
  );
});

module.exports = router;
