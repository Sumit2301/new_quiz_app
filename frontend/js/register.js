// register.js
document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
    });

    const result = await response.json();
    if (response.ok) {
        alert('Registration successful');
        window.location.href = 'login.html'; // Redirect to login page
    } else {
        alert(result.error);
    }
});
