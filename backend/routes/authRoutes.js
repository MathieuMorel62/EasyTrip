import express from 'express';
import { signup, login, googleLogin } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateSignup } from '../utils/validators.js';

// Création d'un routeur Express
const router = express.Router();

// Définition des routes pour l'authentification avec limiteur de taux et validation des données d'inscription
router.post('/signup', authLimiter, validateSignup, signup);
router.post('/login', authLimiter, login);
router.post('/google-login', googleLogin);


export default router;


