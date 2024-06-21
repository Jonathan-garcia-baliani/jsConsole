// db.js
const sqlite3 = require('sqlite3').verbose();

// Crea una base de datos SQLite en memoria
const db = new sqlite3.Database(':memory:');

// Define la estructura de la tabla 'users' dentro de la base de datos
db.serialize(() => {
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    )`);
});

// Exporta la instancia de la base de datos para ser utilizada en otros archivos
module.exports = db;
