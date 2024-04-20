const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return username && username.length >= 1;
}

const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    return !!user;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            username: username
        }, 'access', { expiresIn: '1h' });

        req.session.authorization = {
            accessToken,
            username
        }
        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!review) {
        return res.status(400).json({ message: 'Review is required' });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Check if the user already has a review for the book
    if (books[isbn].reviews[username]) {
        // Modify the existing review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: 'Review modified successfully' });
    } else {
        // Add a new review
        books[isbn].reviews[username] = review;
        return res.status(201).json({ message: 'Review added successfully' });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: 'Review not found' });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports = {
    authenticated: regd_users,
    isValid: isValid,
    users: users
};
