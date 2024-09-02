import db from '../config/db.js';
import crypto from 'crypto';


// Fonction pour créer un nouvel utilisateur dans la db
export const createUser = (email, hashedPassword, firstName, lastName, callback) => {
  // Requête SQL pour insérer un nouvel utilisateur dans la db
  const query = 'INSERT INTO users (id, email, password, firstName, lastName) VALUES (UUID(), ?, ?, ?, ?)';
  // Exécution de la requête SQL avec les paramètres fournis
  db.query(query, [email, hashedPassword, firstName, lastName], callback);
};


// Fonction pour trouver un utilisateur par son email dans la db
export const findUserByEmail = (email, callback) => {
  // Requête SQL pour trouver un utilisateur par son email
  const query = 'SELECT * FROM users WHERE email = ?';
  // Exécution de la requête SQL avec les paramètres fournis
  db.query(query, [email], callback);
};


// Fonction pour créer un nouvel utilisateur Google dans la db
export const createGoogleUser = (email, fullName, hashedPassword, callback) => {
  // Décomposer le nom complet en prénom et nom de famille
  const names = fullName.split(' ');
  const firstName = names[0];
  const lastName = names.slice(1).join(' ');

  // Génère un mot de passe aléatoire si le mot de passe est vide
  if (!hashedPassword) {
    hashedPassword = crypto.randomBytes(8).toString('hex');
  }

  // Requête SQL pour insérer un nouvel utilisateur Google dans la db
  const query = 'INSERT INTO users (id, email, firstName, lastName, password) VALUES (UUID(), ?, ?, ?, ?)';

  // Exécution de la requête SQL avec les paramètres fournis
  db.query(query, [email, firstName, lastName, hashedPassword], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de l\'utilisateur Google:', err);
      return callback(err);
    }
    console.log('Utilisateur Google inséré avec succès:', result);

    // Récupérer l'ID de l'utilisateur nouvellement créé
    const getUserQuery = 'SELECT id FROM users WHERE email = ?';
    db.query(getUserQuery, [email], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur:', err);
        return callback(err);
      }
      const userId = results[0].id;
      callback(null, { userId, result });
    });
  });
};
