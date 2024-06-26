const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa la configuración de la base de datos
const bcrypt = require('bcryptjs');

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const database = db.getDb();

        // Buscar usuario por nombre de usuario
        const user = await database.collection('usuarios').findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso.', user });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
