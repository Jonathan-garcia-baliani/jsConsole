// db.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'turismo';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Conectado a MongoDB');
        db = client.db(dbName);
    } catch (err) {
        console.error(err);
    }
}

function getDb() {
    return db;
}

module.exports = {
    connectToMongo,
    getDb,
};
