// routes/carritoRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener productos en el carrito
router.get('/', async (req, res) => {
    try {
        const database = db.getDb();
        const productos = await database.collection('carrito').find().toArray();
        res.json(productos);
    } catch (err) {
        console.error('Error al obtener productos del carrito:', err);
        res.status(500).json({ error: 'Error al obtener productos del carrito' });
    }
});

// Agregar un producto al carrito
router.post('/', async (req, res) => {
    try {
        const nuevoProducto = req.body;
        const database = db.getDb();
        const resultado = await database.collection('carrito').insertOne(nuevoProducto);
        res.status(201).json(resultado.ops[0]);
    } catch (err) {
        console.error('Error al agregar producto al carrito:', err);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// Eliminar un producto del carrito
router.delete('/:id', async (req, res) => {
    try {
        const idProducto = req.params.id;
        const database = db.getDb();
        const resultado = await database.collection('carrito').deleteOne({ _id: ObjectId(idProducto) });
        res.json({ message: `Producto con ID ${idProducto} eliminado del carrito` });
    } catch (err) {
        console.error('Error al eliminar producto del carrito:', err);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

module.exports = router;
