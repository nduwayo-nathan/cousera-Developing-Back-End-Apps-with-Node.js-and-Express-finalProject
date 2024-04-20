const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js');

const app = express();

app.use(express.json());

// Configure session middleware
app.use(session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Middleware function to authenticate routes under '/customer/auth/*'
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session && req.session.authorization && req.session.authorization.accessToken) {
        const token = req.session.authorization.accessToken;
        jwt.verify(token, "access", (err, user) => {
            if (err) {
                return res.status(403).json({ message: "User not authenticated" });
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Routes for registered users
app.use("/customer", customer_routes);

// General routes
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log("Server is running"));
