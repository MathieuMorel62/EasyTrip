import rateLimit from "express-rate-limit";

// Configuration du limiteur de taux pour les requêtes d'authentification
export const authLimiter = rateLimit({
  // Définit la fenêtre de temps pour le limiteur de taux à 15 minutes
  windowMs: 15 * 60 * 1000,
  // Limite chaque IP à 10 requêtes par fenêtre de 15 minutes
  max: 10,
  message:
    "Trop de tentatives de connexion depuis cette IP, veuillez réessayer après 15 minutes.",
});
