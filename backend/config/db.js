import mysql from 'mysql2/promise';

const db = {
  connection: null,
  connect: async () => {
    try {
      db.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      await db.connection.connect();
      console.log('Connecté à la base de données MySQL');
    } catch (err) {
      console.error('Erreur de connexion à MySQL:', err);
      throw err;
    }
  },
  query: async (sql, params) => {
    if (!db.connection) {
      await db.connect();
    }
    return db.connection.query(sql, params);
  },
};

export default db;
