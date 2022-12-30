import { Examen, ExamenScore, User } from '../database/Sequelize.js';

export default app => {
  app.post('/api/getScores', (req, res) => {
    User.findOne({ where: { id: req.body.userId }, include: { model: ExamenScore, include: { model: Examen } } })
      .then(user => {
        res.json({user})
      })
      .catch(err => {
        console.log(req.body.userId);
        res.status(400).json({ msg: 'error introuvable', err });
      });
  });
};
