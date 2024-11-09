document.addEventListener('DOMContentLoaded', function () {
    const testSelect = document.getElementById('test-select');
    const questionsContainer = document.getElementById('questions-container');
    const submitButton = document.getElementById('submit-btn');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');
    const resultContainer = document.getElementById('result-container');

    let currentQuestionIndex = 0;
    let questions = [];
    const userAnswers = [];

    // Get the selected test from localStorage
    let testId = localStorage.getItem('selectedTest') || "test1";  // Default to test1 if nothing is set

    // Fetch quiz data for the selected test
    function loadQuizData(testId) {
        fetch(`/api/quiz/${testId}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.questions) {
                    questions = data.questions;
                    showQuestion(currentQuestionIndex);
                } else {
                    console.error('Invalid quiz data received');
                }
            })
            .catch(error => console.error('Error fetching quiz data:', error));
    }

    // Load quiz data when the page loads
    loadQuizData(testId);

    function showQuestion(index) {
        questionsContainer.innerHTML = '';
        const question = questions[index];

        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${question.question}`;
        questionElement.appendChild(questionText);

        question.options.forEach(option => {
            const optionElement = document.createElement('label');
            const inputElement = document.createElement('input');
            inputElement.type = 'radio';
            inputElement.name = `question-${index}`;
            inputElement.value = option;
            inputElement.checked = userAnswers[index] === option;
            inputElement.addEventListener('change', () => {
                userAnswers[index] = option;
                nextButton.disabled = false;
            });

            optionElement.appendChild(inputElement);
            optionElement.appendChild(document.createTextNode(option));
            questionElement.appendChild(optionElement);
        });

        questionsContainer.appendChild(questionElement);

        nextButton.disabled = !userAnswers[index];
        prevButton.disabled = index === 0;
    }

    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    });

    submitButton.addEventListener('click', () => {
        fetch('/api/submit-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 1, // Example user ID (can be dynamic)
                answers: userAnswers,
                testId
            })
        })
        .then(response => response.json())
        .then(result => {
            // Redirect to result page with score data
            localStorage.setItem('quizResult', JSON.stringify(result.result));
            window.location.href = 'result.html';
        })
        .catch(error => console.error('Error submitting quiz:', error));
    });
});
