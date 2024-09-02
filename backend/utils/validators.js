import { body } from 'express-validator';


// Signup validation pour les nouveaux utilisateurs
export const validateSignup = [
  body('firstName').not().isEmpty().withMessage('Le prénom est obligatoire'),
  body('lastName').not().isEmpty().withMessage('Le nom est obligatoire'),
  body('email').isEmail().withMessage('Email invalide'),

  // Validation du mot de passe avec des critères de sécurité
  body('password')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule')
    .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre')
    .matches(/[\W]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),

  // Validation du mot de passe de confirmation
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Les mots de passe ne correspondent pas'),
];
