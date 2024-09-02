import jwt from 'jsonwebtoken';


// Middleware pour vérifier le token JWT
export const verifyToken = (req, res, next) => {
  // Récupérer le token dans les headers de la requête
  const token = req.headers['authorization'];

  // Si le token n'est pas présent, renvoyer une erreur 403
  if (!token) {
    return res.status(403).send('Token requis');
  }

  try {
    // Vérifie et décode le token en utilisant la clé secrète JWT
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send('Token invalide');
  }
};
