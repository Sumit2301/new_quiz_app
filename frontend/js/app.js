document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            alert('Login successful');
            window.location.href = 'quiz.html'; // Redirect to quiz page
        } else {
            alert('Invalid email or password');
        }
    })
    .catch(error => alert('Login failed: ' + error.message));
});


// Handle Registration
document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User registered successfully') {
            alert('Registration successful');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            alert(data.message || 'Registration failed');
        }
    })
    .catch(error => alert('Registration failed: ' + error.message));
});
// Handle Quiz Selection
document.getElementById('quiz-selection-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const selectedTest = document.getElementById('test-selection').value;

    if (!selectedTest) {
        alert('Please select a test.');
        return;
    }

    fetch(`http://localhost:3000/api/quiz/${selectedTest}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = ''; // Clear any previous quiz

        data.questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.innerHTML = `
                <h3>${question.question}</h3>
                <input type="radio" name="q${index}" value="A"> ${question.optionA} <br>
                <input type="radio" name="q${index}" value="B"> ${question.optionB} <br>
                <input type="radio" name="q${index}" value="C"> ${question.optionC} <br>
                <input type="radio" name="q${index}" value="D"> ${question.optionD} <br>
            `;
            quizContainer.appendChild(questionElement);
        });

        document.getElementById('submit-quiz').style.display = 'block'; // Show submit button
    });
});

// Handle Quiz Submission
document.getElementById('submit-quiz').addEventListener('click', function () {
    const answers = [];
    const quizContainer = document.getElementById('quiz-container');
    const questions = quizContainer.getElementsByTagName('div');

    Array.from(questions).forEach((question, index) => {
        const selectedAnswer = question.querySelector('input[type="radio"]:checked');
        if (selectedAnswer) {
            answers.push(selectedAnswer.value);
        } else {
            answers.push(null); // If no answer selected
        }
    });

    fetch('http://localhost:3000/api/save-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, answers }) // Assuming userId 1 for now
    })
    .then(response => response.json())
    .then(data => {
        alert('Quiz submitted successfully!');
    })
    .catch(error => alert('Failed to submit answers'));
});
