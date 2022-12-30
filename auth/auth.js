import { private_key } from './private_key.js';
import jwt from 'jsonwebtoken';
const auth = (req, res, next) => {
  // console.log(req.route)
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
    return res.status(401).json({ message });
  }

  const token = authorizationHeader.split(' ')[1];
  const decodedToken = jwt.verify(token, private_key, (error, decodedToken) => {
    if (error) {
      const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`;
      return res.status(401).json({ message, data: error });
    }

    const userId = decodedToken.userId;
    if ((req.body.userId && req.body.userId !== userId) || (req.query.userId && parseInt(req.query.userId) !== userId)) {
      const message = `L'identifiant de l'utilisateur est invalide.`;
      res.status(401).json({ message });
    } else {
      next();
    }
  });
};
export default auth;
