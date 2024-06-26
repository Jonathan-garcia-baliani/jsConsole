// login.js
document.querySelector('#loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;

    const data = { username, password };

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.redirectUrl) {
            window.location.href = result.redirectUrl;
        } else {
            document.getElementById('mensaje').innerText = result.message;
        }
    } catch (error) {
        document.getElementById('mensaje').innerText = 'Error al iniciar sesión';
        console.error('Error:', error);
    }
});
