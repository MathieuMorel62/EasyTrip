import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { validationResult } from 'express-validator';
import { createGoogleUser, findUserByEmail } from '../../backend/models/User.js';
import axios from 'axios';



// Fonction pour enregistrer un nouvel utilisateur
export const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO users (id, email, password, firstName, lastName) VALUES (UUID(), ?, ?, ?, ?)';
  db.query(query, [email, hashedPassword, firstName, lastName], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de l\'utilisateur:', err);
      return res.status(500).send('Erreur serveur');
    }

    const user = { id: result.insertId, email, firstName, lastName };
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '48h' });

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}` } });
  });
};


// Fonction de gestion de la connexion des utilisateurs
export const login = (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  // Recherche de l'utilisateur dans la base de données
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).send('Erreur serveur');

    // Vérification de l'existence de l'utilisateur
    if (results.length > 0) {
      const user = results[0];
      // Comparaison du mot de passe fourni avec le mot de passe hashé dans la base de données
      const isMatch = await bcrypt.compare(password, user.password);

      // Si le mot de passe est correct, génération d'un token JWT
      if (isMatch) {
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '48h' });
        res.json({ token, user: { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}` } });
      } else {
        res.status(401).send('Email ou mot de passe incorrect');
      }
    } else {
      res.status(401).send('Email ou mot de passe incorrect');
    }
  });
};


// Fonction de connexion avec Google
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Récupération des informations de l'utilisateur avec le token Google
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    // Récupération des informations de l'utilisateur
    const { email, name } = response.data;

    // Génération d'un mot de passe aléatoire
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Vérification de l'existence de l'utilisateur
    findUserByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la vérification de l\'utilisateur' });
      }

      if (user.length > 0) {
        // L'utilisateur existe déjà, générez un token JWT pour lui
        const existingUser = user[0];
        const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET, {
          expiresIn: '24h',
        });

        // Renvoi du token dans la réponse
        return res.status(200).json({ token, user: { id: existingUser.id, email: existingUser.email, name } });
      } else {
        // Si l'utilisateur n'existe pas, création d'un nouvel utilisateur
        createGoogleUser(email, name, hashedPassword, (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur Google' });
          }

          // Récupération de l'ID de l'utilisateur nouvellement créé
          const { userId } = result;

          // Génération du token JWT pour l'utilisateur
          const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
            expiresIn: '24h',
          });

          // Renvoi du token dans la réponse
          res.status(201).json({ token, user: { id: userId, email, name } });
        });
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion avec Google:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion avec Google' });
  }
};
