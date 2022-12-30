import { Examen, ExamenScore, User } from '../database/Sequelize.js';

export default app => {
  app.post('/api/scoreTestExam', (req, res) => {
    let UserId = req.body.userId;
    let examenId = req.body.examenId;
    let note = req.body.note;
    let nbQuestions = req.body.nbQuestions;
    if (!UserId || !examenId || !nbQuestions) {
      return res.status(404).json({ msg: 'something went wrong' });
    } else {
      User.findOne({ where: { id: UserId } }).then(user => {
        Examen.findOne({ where: { id: examenId } })
          .then(exam => {
            ExamenScore.create({
              note,
              nbQuestions,
            }).then(score => {
              score.setExamen(exam);
              user.addExamenScore(score);
            });
          })
          .then(_ => {
            res.json({ msg: 'done !' });
          });
      });
    }
  });
};
