const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Define paths to your quiz data JSON files
const test1FilePath = path.join(__dirname, '../data/test1.json');
const test2FilePath = path.join(__dirname, '../data/test2.json');
const test3FilePath = path.join(__dirname, '../data/test3.json');

// Fetch quiz questions based on selected test (test1, test2, test3)
router.get('/quiz/:testId', (req, res) => {
    const { testId } = req.params;  // Get the testId from the request parameters

    // Determine which quiz file to load based on the testId
    let quizFilePath;
    if (testId === 'test1') {
        quizFilePath = test1FilePath;
    } else if (testId === 'test2') {
        quizFilePath = test2FilePath;
    } else if (testId === 'test3') {
        quizFilePath = test3FilePath;
    } else {
        return res.status(404).json({ message: 'Quiz not found' });
    }

    // Read the quiz data from the corresponding JSON file
    fs.readFile(quizFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading quiz data' });
        }

        const quiz = JSON.parse(data);  // Parse the quiz data from JSON
        res.status(200).json(quiz);  // Return the quiz questions in the response
    });
});

module.exports = router;
