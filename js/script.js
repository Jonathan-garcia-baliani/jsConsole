// Variables globales para realizar un seguimiento de los intentos fallidos y el estado de bloqueo
let intentosFallidos = 0;
let bloqueado = false;
const tiempoBloqueo = 180; // Tiempo en segundos (3 minutos)

// Función para validar el inicio de sesión
function validateLogin() {
    // Verifica si el usuario está bloqueado
    if (bloqueado) {
        alert(
            "Has intentado iniciar sesión 3 veces sin éxito. Por seguridad, debes esperar 3 minutos antes de intentarlo nuevamente."
        );
        return;
    }

    // Obtiene los valores de los campos de usuario y contraseña del formulario
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Realiza la solicitud POST al servidor para validar el inicio de sesión
    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then(handleLoginResponse)
    .catch((error) => {
        console.error("Error:", error);
        handleFailedLogin(); // Maneja el intento fallido de inicio de sesión
    });
}

// Función para manejar el inicio de sesión exitoso
function handleLoginResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json().then((data) => {
        alert(data.message);

        if (data.redirectUrl) {
            sessionStorage.setItem("isLoggedIn", true);
            sessionStorage.setItem("username", data.username);

            // Actualizar texto del perfil
            updateProfileText(data.username);

            // Actualizar texto de bienvenida
            updateWelcomeText(data.username);

            // Actualizar navegación
            updateNavigation(data.username);

            window.location.href = data.redirectUrl; // Redirige a ingreso.html u otra página
        }
    });
}

// Función para manejar los intentos fallidos de inicio de sesión
function handleFailedLogin() {
    intentosFallidos++;
    if (intentosFallidos >= 3) {
        bloqueado = true;
        setTimeout(() => {
            bloqueado = false;
            intentosFallidos = 0;
        }, tiempoBloqueo * 1000); // Desbloquea al usuario después del tiempo especificado
    }
}

// Función para actualizar el texto del perfil
function updateProfileText(username) {
    const perfilElement = document.getElementById("perfilText");
    perfilElement.textContent = `Perfil: ${username}`;
}

// Función para actualizar el texto de bienvenida
function updateWelcomeText(username) {
    const welcomeElement = document.getElementById("welcomeText");
    if (welcomeElement) {
        welcomeElement.textContent = `Bienvenido, ${username}`;
    }
}

// Función para actualizar la navegación después de iniciar sesión
function updateNavigation(username) {
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.innerHTML = `<a href="#">Logout</a>`;
        loginBtn.onclick = function () {
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("username");
            window.location.href = "login.html";
        };

        const navList = document.querySelector(".nav-list");
        if (navList) {
            const loginLink = navList.querySelector(".btn a[href='login.html']");
            if (loginLink) {
                const li = loginLink.parentElement;
                li.remove();
            }

            const profileLink = document.createElement("li");
            profileLink.classList.add("item");
            profileLink.innerHTML = `<a href="ingreso.html">Perfil ${username}</a>`; // Incluye el nombre de usuario
            navList.appendChild(profileLink);
        }
    }

    // Ocultar formulario de inicio de sesión si el usuario está logueado
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.style.display = "none";
    }
}

// Manipulación de elementos al cargar el documento
document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
        // Si el usuario ha iniciado sesión, actualiza la navegación y otros textos necesarios
        const username = sessionStorage.getItem("username");
        updateNavigation(username); // Actualiza la navegación con el nombre de usuario almacenado
        updateProfileText(username); // Actualiza el texto del perfil con el nombre de usuario
        updateWelcomeText(username); // Actualiza el texto de bienvenida con el nombre de usuario
    }
});
