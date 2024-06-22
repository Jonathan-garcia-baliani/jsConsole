const db = require('./db');

async function insertUser(user) {
  const database = db.getDb();
  const result = await database.collection('usuarios').insertOne(user);
  console.log(`Nuevo usuario insertado con el ID: ${result.insertedId}`);
}

async function findUsers() {
  const database = db.getDb();
  const users = await database.collection('usuarios').find().toArray();
  console.log('Usuarios encontrados:');
  console.log(users);
}

async function updateUser(userId, updatedData) {
  const database = db.getDb();
  const result = await database.collection('usuarios').updateOne(
    { _id: userId },
    { $set: updatedData }
  );
  console.log(`${result.modifiedCount} usuario(s) actualizado(s)`);
}

async function deleteUser(userId) {
  const database = db.getDb();
  const result = await database.collection('usuarios').deleteOne({ _id: userId });
  console.log(`${result.deletedCount} usuario(s) eliminado(s)`);
}

module.exports = {
  insertUser,
  findUsers,
  updateUser,
  deleteUser,
};
