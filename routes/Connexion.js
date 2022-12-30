import { Examen, ExamenScore, User, WebsiteStats } from '../database/Sequelize.js';
import jwt from 'jsonwebtoken';
import { private_key } from '../auth/private_key.js';
import { io, onlineUsers, visitesDuJour } from '../index.js';
export default app => {
  app.post('/api/connexion', (req, res) => {
    User.findOne({ where: { email: req.body.email }, include: { model: ExamenScore, include: { model: Examen } } })
      .then(user => {
        if (user.password === req.body.password) {
          console.log('connexion reussie \n', user.toJSON());
          const token = jwt.sign({ userId: user.id }, private_key, { expiresIn: '24h' });
          user.online = 1;
          if (onlineUsers.filter(u => u.id === user.id).length === 0) {
            let a = user.dataValues;
            delete a.password;
            console.log('a', a);
            onlineUsers.push(a);
          }
          console.log('onlineUsers :', onlineUsers);
          WebsiteStats.findByPk(1).then(stats => {
            stats.visites++;
            // visitesDuJour[0]++
            stats.save().then(err =>
              user.save().then(err2 => {
                io.emit('userList', onlineUsers);
                res.json({ msg: 'connexion reussie', user, token });
              })
            );
          });
        } else {
          console.log('connexion echouee ');
          res.status(400).json({ msg: 'mauvais mot de passe' });
        }
      })
      .catch(err => {
        console.log(req.body.email);
        res.status(400).json({ msg: 'connexion echouee email introuvable', err });
      });
  });
};
