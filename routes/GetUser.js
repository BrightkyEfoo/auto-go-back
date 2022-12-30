import { User, Theme } from '../database/Sequelize.js';
import { Op } from 'sequelize';
export default app => {
  app.get('/api/users', (req, res) => {
    if (req.query.userId) {
      User.findOne({
        where: {
          id: req.query.userId,
        },
        order: ['nom'],
        include: [
          {
            model: Theme,
            through: {
              attributes: ['UserId', 'ThemeId'],
            },
          },
        ],
      })
        .then(user => {
          res.json({message : 'user found' , user})
        })
        .catch(err => res.status(400).json({ msg: 'User not found', err }));
    } else {
      User.findAll({
        order: ['nom'],
        include: [
          {
            model: Theme,
            through: {
              attributes: ['UserId', 'ThemeId'],
            },
          },
        ],
      })
        .then(data => res.json({ msg: 'liste des users recuperee', data : data.map(d => {

          return {nom : d.nom , prenom: d.prenom}
        }) }))
        .catch(err => res.status(500).json({ msg: 'erreur liee a la base', err }));
    }
  });
};
