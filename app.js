require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'turismo';

MongoClient.connect(mongoUri)
    .then(client => {
        console.log('Conexión exitosa a MongoDB');
        const db = client.db(dbName);

        app.post('/api/register', async (req, res) => {
            const { username, password, email, age } = req.body;
            if (!username || !password || !email || !age) {
                return res.status(400).json({ message: 'Todos los campos son requeridos.' });
            }
            const existingUser = await db.collection('usuarios').findOne({ username });
            if (existingUser) return res.status(400).json({ message: 'El usuario ya existe.' });
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.collection('usuarios').insertOne({ username, password: hashedPassword, email, age });
            res.status(201).json({ message: 'Usuario registrado correctamente', redirectUrl: '/login.html' });
        });

        app.post('/api/login', async (req, res) => {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos.' });
            }
            const user = await db.collection('usuarios').findOne({ username });
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Credenciales incorrectas' });
            res.status(200).json({ message: 'Inicio de sesión exitoso', redirectUrl: '/ingreso.html', username: user.username });
        });

        app.use(express.static(path.join(__dirname, 'Frontend', 'html')));

        // Rutas para servir archivos HTML
        app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'Frontend', 'html', 'login.html')));
        app.get('/ingreso.html', (req, res) => res.sendFile(path.join(__dirname, 'Frontend', 'html', 'ingreso.html')));
        app.get('/registro.html', (req, res) => res.sendFile(path.join(__dirname, 'Frontend', 'html', 'registro.html')));

        // Ruta para manejar cualquier otra solicitud a archivos estáticos
        app.use(express.static(path.join(__dirname, 'Frontend')));

        app.listen(port, () => console.log(`Servidor iniciado en http://localhost:${port}`));
    })
    .catch(err => console.error('Error conectando a MongoDB:', err));
