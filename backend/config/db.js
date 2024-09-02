import mysql from 'mysql2';
import dotenv from 'dotenv';

// Charge les variables depuis le fichier .env
dotenv.config();

// Crée une connexion à la base de données MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Etablit la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    throw err;
  }
  console.log('Connexion à MySQL réussie...');
});

export default db;
