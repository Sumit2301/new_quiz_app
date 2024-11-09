const fs = require('fs');
const path = require('path');

// Paths to quiz data files
const test1FilePath = path.join(__dirname, '../data/test1.json');
const test2FilePath = path.join(__dirname, '../data/test2.json');
const test3FilePath = path.join(__dirname, '../data/test3.json');

// Fetch quiz questions based on selected test
exports.getQuiz = (req, res) => {
    const { testId } = req.params;  // Get the testId from the request URL

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

    // Read the quiz data file
    fs.readFile(quizFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading quiz data' });
        }

        const quiz = JSON.parse(data);
        res.status(200).json(quiz); // Return quiz questions
    });
};

// Save answers and calculate results
exports.saveAnswers = (req, res) => {
    const { userId, answers, testId } = req.body;

    let quizFilePath;
    if (testId === 'test1') quizFilePath = test1FilePath;
    else if (testId === 'test2') quizFilePath = test2FilePath;
    else if (testId === 'test3') quizFilePath = test3FilePath;
    else return res.status(404).json({ message: 'Quiz not found' });

    fs.readFile(quizFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading quiz data' });
        }

        const quiz = JSON.parse(data);
        let score = 0;

        // Compare the answers with the correct ones
        quiz.questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                score++;
            }
        });

        // Save the results to result.json
        const resultsFilePath = path.join(__dirname, '../data/result.json');
        fs.readFile(resultsFilePath, 'utf8', (err, resultData) => {
            if (err) {
                return res.status(500).json({ message: 'Error reading results data' });
            }

            let results = resultData ? JSON.parse(resultData) : [];
            const result = { userId, testId, score, totalQuestions: quiz.questions.length };
            results.push(result);

            fs.writeFile(resultsFilePath, JSON.stringify(results, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error saving result' });
                }
                res.status(200).json({ message: 'Quiz submitted successfully', result });
            });
        });
    });
};
