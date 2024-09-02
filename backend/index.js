import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import tripsRoutes from './routes/tripsRoutes.js';

// Configuration de dotenv pour charger les variables d'environnement
dotenv.config();

// Configuration de l'application Express
const app = express();
// Middleware pour parser les données JSON
app.use(express.json());
// Middleware pour activer CORS
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);

// Configuration du port d'écoute pour le serveur
const PORT = process.env.PORT || 5001;
// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    console.log(`Environnement: ${process.env.NODE_ENV || 'développement'}`);
    console.log(`CORS activé: ${cors ? 'Oui' : 'Non'}`);
    console.log(`Routes chargées: /api/auth`);
});
