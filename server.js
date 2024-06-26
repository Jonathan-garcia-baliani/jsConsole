// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Conectar a MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'turismo';

MongoClient.connect(mongoUri)
    .then(client => {
        console.log('Conexión exitosa a MongoDB');
        const db = client.db(dbName);

        // Registro de usuario
        app.post('/api/register', async (req, res) => {
            const { username, password, email, age } = req.body;
            const existingUser = await db.collection('usuarios').findOne({ username });
            if (existingUser) return res.status(400).json({ message: 'El usuario ya existe.' });
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.collection('usuarios').insertOne({ username, password: hashedPassword, email, age });
            res.status(201).json({ message: 'Usuario registrado correctamente', redirectUrl: '/login.html' });
        });

        // Inicio de sesión
        app.post('/api/login', async (req, res) => {
            const { username, password } = req.body;
            const user = await db.collection('usuarios').findOne({ username });
            if (!user) return res.status(404).send('Usuario no encontrado');
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).send('Credenciales incorrectas');
            res.status(200).json({ message: 'Inicio de sesión exitoso', redirectUrl: '/ingreso.html', username: user.username });
        });

        // Servir archivos estáticos
        app.use(express.static(path.join(__dirname, 'html')));
        app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'html', 'login.html')));

        app.listen(port, () => console.log(`Servidor iniciado en http://localhost:${port}`));
    })
    .catch(err => console.error('Error conectando a MongoDB:', err));
