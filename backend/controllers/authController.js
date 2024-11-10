import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { validationResult } from "express-validator";
import { findUserByEmail } from "../models/User.js";
import axios from "axios";
import { sendWelcomeEmail, sendPasswordChangeEmail } from "../utils/emailService.js";

// Fonction pour enregistrer un nouvel utilisateur
export const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Récupérer les données de l'utilisateur à partir du corps de la requête
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insertion de l'utilisateur
  const query =
    "INSERT INTO users (id, email, password, firstName, lastName) VALUES (UUID(), ?, ?, ?, ?)";
  db.query(query, [email, hashedPassword, firstName, lastName], (err) => {
    if (err) {
      console.error("Erreur lors de l'insertion de l'utilisateur:", err);
      return res.status(500).send("Erreur serveur");
    }

    // Récupérer l'UUID de l'utilisateur nouvellement créé
    const selectQuery = "SELECT id FROM users WHERE email = ?";
    db.query(selectQuery, [email], (err, results) => {
      if (err || results.length === 0) {
        console.error(
          "Erreur lors de la récupération de l'ID utilisateur:",
          err
        );
        return res.status(500).send("Erreur serveur");
      }

      // Générer un token JWT pour l'utilisateur
      const user = results[0];
      const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, {
        expiresIn: "48h",
      });

      // Envoyer l'email de bienvenue
      sendWelcomeEmail(email, firstName);

      // Renvoyer le token et les informations de l'utilisateur
      res.status(201).json({
        token,
        user: { id: user.id, email, name: `${firstName} ${lastName}` },
      });
    });
  });
};

// Fonction de gestion de la connexion des utilisateurs
export const login = (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";

  // Recherche de l'utilisateur dans la base de données
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).send("Erreur serveur");

    // Vérification de l'existence de l'utilisateur
    if (results.length > 0) {
      const user = results[0];
      // Comparaison du mot de passe fourni avec le mot de passe hashé dans la base de données
      const isMatch = await bcrypt.compare(password, user.password);

      // Si le mot de passe est correct, génération d'un token JWT
      if (isMatch) {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "48h" }
        );
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          },
        });
      } else {
        res.status(401).send("Email ou mot de passe incorrect");
      }
    } else {
      res.status(401).send("Email ou mot de passe incorrect");
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
          Accept: "application/json",
        },
      }
    );

    // Extraire les informations de l'utilisateur depuis la réponse Google
    const { email, name } = response.data;

    // Séparer le prénom et le nom à partir de `name`
    const [firstName, lastName] = name.split(" ");

    // Vérification de l'existence de l'utilisateur dans la base de données
    findUserByEmail(email, (err, user) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Erreur lors de la vérification de l'utilisateur" });
      }

      if (user.length > 0) {
        // L'utilisateur existe déjà, on génère un token JWT pour lui
        const existingUser = user[0];
        const token = jwt.sign(
          { id: existingUser.id, email: existingUser.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );

        // Renvoi du token et des informations utilisateur
        return res.status(200).json({
          token,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: `${existingUser.firstName} ${existingUser.lastName}`,
          },
        });
      } else {
        // Si l'utilisateur n'existe pas, on le crée
        const randomPassword = Math.random().toString(36).slice(-8); // Générer un mot de passe aléatoire
        const hashedPassword = bcrypt.hashSync(randomPassword, 10);

        // Insertion de l'utilisateur dans la base de données
        const createQuery =
          "INSERT INTO users (id, email, password, firstName, lastName) VALUES (UUID(), ?, ?, ?, ?)";
        db.query(
          createQuery,
          [email, hashedPassword, firstName, lastName],
          (err) => {
            if (err) {
              return res.status(500).json({
                error: "Erreur lors de la création de l'utilisateur Google",
              });
            }

            // Récupérer l'UUID de l'utilisateur nouvellement créé
            const selectQuery = "SELECT id FROM users WHERE email = ?";
            db.query(selectQuery, [email], (err, results) => {
              if (err || results.length === 0) {
                return res.status(500).json({
                  error: "Erreur lors de la récupération de l'ID utilisateur",
                });
              }

              // Génération d'un token JWT pour l'utilisateur
              const newUser = results[0];
              const token = jwt.sign(
                { id: newUser.id, email },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
              );

              // Envoi d'un email à l'utilisateur pour changer son mot de passe
              sendPasswordChangeEmail(email, randomPassword);

              // Renvoi du token et des informations utilisateur
              res.status(201).json({
                token,
                user: {
                  id: newUser.id,
                  email,
                  name: `${firstName} ${lastName}`,
                },
              });
            });
          }
        );
      }
    });
  } catch (error) {
    console.error("Erreur lors de la connexion avec Google:", error);
    res.status(500).json({ error: "Erreur lors de la connexion avec Google" });
  }
};

// Fonction de mise à jour de l'utilisateur
export const updateUser = (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const userId = req.user.id;

  // Construction de la requête SQL pour mettre à jour les données de l'utilisateur
  let query = "UPDATE users SET email = ?, firstName = ?, lastName = ?";
  const params = [email, firstName, lastName];

  // Si un mot de passe est fourni, le mettre à jour dans la base de données
  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    query += ", password = ?";
    params.push(hashedPassword);
  }

  // Ajouter la clause WHERE pour mettre à jour l'utilisateur spécifique
  query += " WHERE id = ?";
  params.push(userId);

  // Exécuter la requête SQL
  db.query(query, params, (err) => {
    if (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
      return res.status(500).send("Erreur serveur");
    }

    // Renvoyer les données mises à jour de l'utilisateur
    res.status(200).json({
      email,
      firstName,
      lastName,
    });
  });
};

// Fonction de suppression de l'utilisateur
export const deleteUser = (req, res) => {
  // Récupérer l'ID de l'utilisateur à partir du token JWT
  const userId = req.user.id;

  // Construction de la requête SQL pour supprimer l'utilisateur
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [userId], (err) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'utilisateur:", err);
      return res.status(500).send("Erreur serveur");
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  });
};
