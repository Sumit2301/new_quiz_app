let users = [];  // In-memory storage for users

// Find user by email
exports.findByEmail = (email, callback) => {
    const user = users.find(user => user.email === email);
    callback(null, user ? [user] : []);
};

// Create a new user
exports.createUser = (firstName, lastName, email, password, callback) => {
    const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        email,
        password,
    };
    users.push(newUser);
    callback(null, newUser);
};

// Update user password
exports.updatePassword = (email, newPassword, callback) => {
    const user = users.find(user => user.email === email);
    if (user) {
        user.password = newPassword;
        callback(null, user);
    } else {
        callback('User not found', null);
    }
};
