const express = require('express');
const router = express.Router();
const users = []; // In-memory storage for users

// Register user
router.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = { id: users.length + 1, firstName, lastName, email, password };
    users.push(newUser);
    res.status(200).json({ message: 'User registered successfully' });
});

// Login user
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
});

module.exports = router;
