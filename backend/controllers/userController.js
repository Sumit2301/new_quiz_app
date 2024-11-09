const fs = require('fs');
const path = require('path');

// Path to users data file
const usersFilePath = path.join(__dirname, '../data/user.json');

// Register user
exports.register = (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Read the existing users from the file
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading user data' });
        }

        // Initialize users if no data exists
        let users = data ? JSON.parse(data) : [];
        
        // Check if the email already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create new user
        const newUser = {
            id: users.length + 1,
            firstName,
            lastName,
            email,
            password
        };

        // Add the new user to the users array
        users.push(newUser);

        // Write the updated users array to the file
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving user data' });
            }
            res.status(200).json({ message: 'User registered successfully' });
        });
    });
};

// Login user
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Read users data from file
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading user data' });
        }

        // Parse user data
        const users = data ? JSON.parse(data) : [];

        // Find the user by email
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the password is correct
        if (user.password !== password) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Respond with user info (for now, returning user ID and name)
        res.status(200).json({
            message: 'Login successful',
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName
        });
    });
};
