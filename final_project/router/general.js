const express = require('express');
const publicUsersRouter = express.Router();
const books = require('./booksdb.js');

// Register a new user
publicUsersRouter.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    users.push({ username, password });

    res.status(201).json({ message: 'User successfully registered' });
});

// Get the list of books available in the shop
publicUsersRouter.get('/', (req, res) => {
    const bookList = Object.values(books);
    res.status(200).json({ books: bookList });
});

// Get book details based on ISBN
publicUsersRouter.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json({ book: book });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Get book details based on author
publicUsersRouter.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const foundBook = Object.values(books).find(book => book.author === author);
    if (foundBook) {
        res.status(200).json({ book: foundBook });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Get all books based on title
publicUsersRouter.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const foundBook = Object.values(books).find(book => book.title === title);
    if (foundBook) {
        res.status(200).json({ book: foundBook });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Get book review
publicUsersRouter.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        const reviews = book.reviews;
        res.status(200).json({ reviews: reviews });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

module.exports = publicUsersRouter;
