// login.js
document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const testId = document.getElementById('test-select').value; // Get selected test

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        // Store selected test in localStorage
        localStorage.setItem('selectedTest', testId);

        // Redirect to quiz page
        window.location.href = 'quiz.html';
    } else {
        alert(result.message || 'Login failed');
    }
});
