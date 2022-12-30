import { Op } from 'sequelize';
import { Examen, ExamenMultimedia, ExamenQuestion, ExamenReponses, ExamenScore, User } from '../../database/Sequelize.js';
import { ArrayCompare } from '../../utils.js';
import userOfflined from '../userOfflined.js';

export default app => {
  app.get('/api/examenById', (req, res) => {
    let id = req.query.id;
    Examen.findOne({
      where: { id: id },
      include: [
        {
          model: ExamenQuestion,
          as: 'questions',
        },
      ],
    }).then(examen => {
      res.json({ examen });
    });
  });

  app.get('/api/examens', (req, res) => {
    // let id = req.query.id
    Examen.findAll({
      where: { type: 'EXAMEN' },
      include: {
        model: ExamenQuestion,
        as: 'questions',
      },
    }).then(examenList => {
      res.json({ examenList });
    });
  });

  app.get('/api/entrainementExamen', (req, res) => {
    // let id = req.query.id
    Examen.findAll({
      where: { type: 'TEST' },
      include: {
        model: ExamenQuestion,
        as: 'questions',
      },
    }).then(examenList => {
      res.json({ examenList });
    });
  });

  app.get('/api/questionsExamenId', (req, res) => {
    let ExamenId = req.query.ExamenId;
    if (ExamenId) {
      ExamenQuestion.findAll({
        where: { ExamenId },
        include: [
          {
            model: ExamenReponses,
            as: 'valide',
          },
          {
            model: ExamenReponses,
            as: 'reponses',
          },
          {
            model: ExamenMultimedia,
            as: 'head',
          },
          {
            model: ExamenMultimedia,
            as: 'audio',
          },
        ],
      }).then(questions => {
        res.json({ questions });
      });
    } else {
      res.status(404).json({ msg: 'Examen Id should be provided as a query params' });
    }
  });

  app.get('/api/ExamenAndQuestions', (req, res) => {
    let ExamenId = parseInt(req.query.ExamenId);
    if (ExamenId) {
      Examen.findOne({
        where: { id: ExamenId },
        include: [
          {
            model: ExamenQuestion,
            as: 'questions',
          },
        ],
      }).then(examen => {
        ExamenQuestion.findAll({
          where: { ExamenId },
          include: [
            {
              model: ExamenReponses,
              as: 'valide',
            },
            {
              model: ExamenReponses,
              as: 'reponses',
            },
            {
              model: ExamenMultimedia,
              as: 'head',
            },
            {
              model: ExamenMultimedia,
              as: 'audio',
            },
          ],
        }).then(questions => {
          res.json({ examen, questions });
        });
      });
    } else {
      res.status(404).json({ msg: 'Examen Id should be provided as a query params' });
    }
  });

  app.post('/api/verifyExamenById', (req, res) => {
    const reponsesChoisies = req.body.reponses;
    const UserId = req.body.userId;
    console.log('reponsesChoisies', reponsesChoisies);
    const examenId = req.body.examenId;
    if (examenId) {
      ExamenQuestion.findAll({
        where: { examenId },
        attributes: ['id', 'title', 'explication'],
        include: [
          {
            model: ExamenReponses,
            as: 'valide',
            attributes: ['id', 'title'],
          },
          {
            model: ExamenReponses,
            as: 'reponses',
            attributes: ['id', 'title', 'valideId'],
            where: {
              valideId: {
                [Op.not]: null,
              },
            },
          },
        ],
      }).then(questions => {
        const reponsesValides = questions.map(q => (q.reponses ? q.reponses : [0]));
        const repsId = questions
          .map(q => (q.reponses ? q.reponses : [0]))
          .map(r => {
            return r.map(reponse => reponse.id);
          });
        console.log('reponsesValides ', repsId);
        let n = 0; //nombre de reponses trouvees
        reponsesChoisies?.forEach(reponses => {
          if (ArrayCompare(reponses, repsId[reponsesChoisies.indexOf(reponses)])) {
            n++;
          }
        });

        // enregistrer
        if (UserId) {
          User.findOne({ where: { id: UserId } }).then(user => {
            Examen.findOne({ where: { id: examenId } })
              .then(exam => {
                ExamenScore.create({
                  note: n,
                  nbQuestions : reponsesValides.length
                }).then(score => {
                  score.setExamen(exam);
                  user.addExamenScore(score);
                });
              })
              .then(_ => {
                res.json({ questions, note: n / reponsesValides.length, reponsesValides, user });
              });
          });
        } else {
          res.status(503).json({ msg: 'unauthorized' });
        }
      });
    } else {
      res.status(404).json({ msg: 'pas bon' });
    }
  });

  app.delete('/api/examen/:id', (req, res) => {
    let ExamenId = parseInt(req.params.id);
    if (isNaN(ExamenId)) {
      return res.status(404).json({ msg: 'bad entry for examen id' });
    } else {
      Examen.findByPk(ExamenId).then(examen => {
        if (examen) {
          Examen.destroy({ where: { id: examen.id } }).then(exam => res.json({ msg: 'succesfully deletd', examen, deletions: exam }));
        } else {
          res.status(404).json({ msg: 'no exam found' });
        }
      });
    }
  });
  app.post('/api/examen/:id', (req, res) => {
    let ExamenId = parseInt(req.params.id);
    if (isNaN(ExamenId)) {
      return res.status(404).json({ msg: 'bad entry for examen id' });
    } else {
      Examen.findByPk(ExamenId).then(examen => {
        if (examen) {
          examen.update({ ...req.body }).then(e => res.json({ msg: 'successfully updated', examen: e }));
        } else {
          res.status(404).json({ msg: 'no exam found' });
        }
      });
    }
  });
};
