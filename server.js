const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { MongoClient } = require('mongodb');

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

// Conectar a MongoDB
const mongoUri = 'mongodb://localhost:27017';
const dbName = 'turismo';

let db;

MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Error conectando a MongoDB:', err);
        return;
    }
    console.log('Conexión exitosa a MongoDB');
    db = client.db(dbName);
});

// Ruta para registrar usuarios
app.post('/register', (req, res) => {
    const { username, password, email, age } = req.body;

    // Hashear la contraseña antes de almacenarla
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('Error en el servidor al hashear la contraseña');
        }

        // Verificar si el usuario ya existe en MongoDB
        db.collection('usuarios').findOne({ username: username }, (err, existingUser) => {
            if (err) {
                return res.status(500).send('Error en el servidor al verificar usuario existente');
            }
            if (existingUser) {
                return res.status(400).send('El nombre de usuario ya está en uso');
            }

            // Insertar nuevo usuario en MongoDB
            db.collection('usuarios').insertOne({ username, password: hashedPassword, email, age }, (err) => {
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

    // Consultar el usuario por nombre de usuario en MongoDB
    db.collection('usuarios').findOne({ username: username }, (err, user) => {
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
