const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para parsear application/json y application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar CORS para permitir solicitudes desde el frontend en http://127.0.0.1:5500
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Configurar base de datos SQLite
const db = new sqlite3.Database(':memory:'); // Usando base de datos en memoria, cambiar a 'database.db' para persistencia

// Crear tabla para usuarios si no existe
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT,
        age INTEGER
    )`);
});

// Ruta para registrar usuarios
app.post('/register', (req, res) => {
    const { username, password, email, age } = req.body;

    // Hashear la contraseña antes de almacenarla
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('Error en el servidor al hashear la contraseña');
        }

        // Verificar si el usuario ya existe
        const query = `SELECT * FROM users WHERE username = ?`;
        db.get(query, [username], (err, existingUser) => {
            if (err) {
                return res.status(500).send('Error en el servidor al verificar usuario existente');
            }
            if (existingUser) {
                return res.status(400).send('El nombre de usuario ya está en uso');
            }

            // Insertar nuevo usuario
            const insertQuery = `INSERT INTO users (username, password, email, age) VALUES (?, ?, ?, ?)`;
            db.run(insertQuery, [username, hashedPassword, email, age], (err) => {
                if (err) {
                    return res.status(500).send('Error registrando al usuario');
                }

                // Enviar respuesta con mensaje y URL de redirección
                res.status(201).json({
                    message: 'Usuario registrado exitosamente',
                    redirectUrl: '/html/login.html' // Ajusta la ruta según tu estructura de archivos
                });
            });
        });
    });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Consultar el usuario por nombre de usuario
    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, user) => {
        if (err) {
            return res.status(500).send('Error al buscar usuario');
        }
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Comparar la contraseña hasheada
        bcrypt.compare(password, user.password, (err, result) => {
            if (err || !result) {
                return res.status(401).send('Credenciales incorrectas');
            }

            // Si las credenciales son válidas, redirige al usuario
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                redirectUrl: '/html/ingreso.html' // Ajusta la ruta según tu estructura de archivos
            });
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
