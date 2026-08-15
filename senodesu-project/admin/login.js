document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save session token
            localStorage.setItem('adminToken', data.session.access_token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            errorMessage.textContent = data.error || 'Login failed';
            errorMessage.classList.add('show');
        }
    } catch (error) {
        errorMessage.textContent = 'Connection error: ' + error.message;
        errorMessage.classList.add('show');
    }
});
