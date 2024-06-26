const { MongoClient } = require('mongodb');

const mongoUri = 'mongodb://localhost:27017';
const dbName = 'turismo';

let db = null;

/**
 * Conecta a la base de datos MongoDB y establece la conexión.
 */
async function connectToDatabase() {
    try {
        const client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión exitosa a MongoDB');
        db = client.db(dbName);
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        throw error; // Lanza el error para ser manejado por quien llame a esta función
    }
}

/**
 * Obtiene la instancia de la base de datos MongoDB.
 * @returns {Db} Instancia de la base de datos MongoDB.
 * @throws {Error} Si la conexión a la base de datos no ha sido establecida todavía.
 */
function getDb() {
    if (!db) {
        throw new Error('La conexión a la base de datos no ha sido establecida todavía');
    }
    return db;
}

module.exports = {
    connectToDatabase,
    getDb
};
