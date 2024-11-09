// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// In-memory data storage
const users = {}; // Stores user info by email
const quizzes = {
    test1: require('./data/test1.json'),  // Points to JSON files in data folder
    test2: require('./data/test2.json'),
};
const results = {}; // Stores quiz results by userId or email

app.use(bodyParser.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the login page (login.html) as the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

// Register route
app.post('/api/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    if (users[email]) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Save user in memory
    users[email] = { firstName, lastName, email, password };
    res.json({ message: 'Registration successful' });
});

// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!users[email] || users[email].password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful' });
});

// Quiz data route
app.get('/api/quiz/:testId', (req, res) => {
    const { testId } = req.params;
    const quiz = quizzes[testId];

    if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ questions: quiz.questions });
});

// Submit quiz results route
app.post('/api/submit-quiz', (req, res) => {
    const { userId, answers, testId } = req.body;
    const quiz = quizzes[testId];

    if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
        if (question.correctAnswer === answers[index]) {
            score++;
        }
    });

    // Save result in memory
    if (!results[userId]) results[userId] = [];
    results[userId].push({ testId, score, totalQuestions: quiz.questions.length });

    res.json({ result: { score, totalQuestions: quiz.questions.length } });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
