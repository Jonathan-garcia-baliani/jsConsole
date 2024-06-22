// usuariosRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/register', async (req, res) => {
    try {
        const { username, password, email, age } = req.body;
        const database = db.getDb();

        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await database.collection('usuarios').findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe. Por favor, elige otro nombre de usuario.' });
        }

        // Insertar nuevo usuario en la base de datos
        const result = await database.collection('usuarios').insertOne({ username, password, email, age });
        res.status(201).json({ message: 'Usuario registrado correctamente.', redirectUrl: '/login.html' });
    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

module.exports = router;
