import express from "express";
import {
  signup,
  login,
  googleLogin,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateSignup } from "../utils/validators.js";
import { verifyToken } from "../middleware/authMiddleware.js";

// Création d'un routeur Express
const router = express.Router();

// Routes pour l'authentification
router.post("/signup", authLimiter, validateSignup, signup);
router.post("/login", authLimiter, login);
router.post("/google-login", googleLogin);

// Routes pour la gestion des utilisateurs
router.put("/update", authLimiter, verifyToken, updateUser);
router.delete("/delete", authLimiter, verifyToken, deleteUser);

export default router;
