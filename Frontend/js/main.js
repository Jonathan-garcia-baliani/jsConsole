import { fetchData } from './fetchData.js';

// URL base de la API
const baseUrl = 'http://localhost:3000';

// URL para registrar usuario
const registerUrl = `${baseUrl}/api/register`;

// URL para iniciar sesión
const loginUrl = `${baseUrl}/api/login`;

// Llama a fetchData con la URL de registro
fetchData(registerUrl);

// Llama a fetchData con la URL de inicio de sesión
fetchData(loginUrl);
