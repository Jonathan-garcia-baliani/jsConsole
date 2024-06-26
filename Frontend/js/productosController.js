// productosController.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Ajusta la ruta según la ubicación de tu archivo db.js
const { ObjectId } = require('mongodb');

// Obtener todos los productos
router.get('/productos', async (req, res) => {
    const database = db.getDb();
    const productos = await database.collection('productos').find().toArray();
    res.json(productos);
});

// Crear un nuevo producto
router.post('/productos', async (req, res) => {
    const database = db.getDb();
    const nuevoProducto = req.body;

    const resultado = await database.collection('productos').insertOne(nuevoProducto);
    res.status(201).json({ message: 'Producto creado', producto: resultado.ops[0] });
});

// Actualizar un producto existente
router.put('/productos/:id', async (req, res) => {
    const database = db.getDb();
    const idProducto = req.params.id;
    const datosActualizados = req.body;

    const resultado = await database.collection('productos').updateOne(
        { _id: ObjectId(idProducto) },
        { $set: datosActualizados }
    );

    res.json({ message: `Producto con ID ${idProducto} actualizado` });
});

// Eliminar un producto
router.delete('/productos/:id', async (req, res) => {
    const database = db.getDb();
    const idProducto = req.params.id;

    const resultado = await database.collection('productos').deleteOne({ _id: ObjectId(idProducto) });
    res.json({ message: `Producto con ID ${idProducto} eliminado` });
});

module.exports = router;
