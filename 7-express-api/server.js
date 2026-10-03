const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Sample data (stored in memory)
let books = [
  { id: 1, title: "Wings of Fire", author: "A.P.J. Abdul Kalam" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho" },
];

// GET - all books
app.get("/books", (req, res) => {
  res.json(books);
});

// GET - one book by id
app.get("/books/:id", (req, res, next) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }
  res.json(book);
});

// POST - add a new book
app.post("/books", (req, res, next) => {
  const { title, author } = req.body;
  if (!title || !author) {
    const err = new Error("Title and author are required");
    err.status = 400;
    return next(err);
  }

  const newBook = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
    title,
    author,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT - update a book
app.put("/books/:id", (req, res, next) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  const { title, author } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  res.json(book);
});

// DELETE - remove a book
app.delete("/books/:id", (req, res, next) => {
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  const deleted = books.splice(index, 1);
  res.json({ message: "Book deleted", book: deleted[0] });
});

// 404 for unknown routes
app.use((req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.status = 404;
  next(err);
});

// Error-handling middleware (has 4 parameters)
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
