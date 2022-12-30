import { Partie, User } from '../database/Sequelize.js';
export default app => {
  app.post('/api/verifyQuizz', (req, res) => {
    let id = req.body.idQuizz;
    let reponses = req.body.reponses;
    let userId = req.body.userId;
    if (id) {
      Partie.findByPk(id).then(partie => {
        if (partie) {
          // console.log('partie.contenu', partie.contenu)
          let listeQuestions = JSON.parse(partie.contenu);

          // console.log('partie.contenu parsed', listeQuestions)
          console.log('id', id);
          console.log('reponses', reponses);
          let reponsesValides = listeQuestions.map(q => q.reponseValide);
          console.log('reponsesValides', reponsesValides);

          let reponsesTrouvees = [] //reponses.filter(r => parseInt(r) === parseInt(reponsesValides[reponses.indexOf(r)]));
          let i = 0;
          for (i = 0; i < reponses.length; i++) {
            if (reponses[i] === parseInt(reponsesValides[i])) {
              reponsesTrouvees.push(reponses[i]);
            }
          }
          console.log('reponsesTrouvees', reponsesTrouvees);
          let note = reponsesTrouvees.length / reponses.length;
          console.log('note', note);
          let msg = '';
          let code = 0;

          if (note === 1) {
            msg = 'Valide avec success';
            code = 1;
          } else {
            msg = `Votre note n'est pas suffisante pour valider ce quizz `;
            code = 3;
          }
          // console.log({msg , note, reponsesValides , code})
          User.findOne({ where: { id: userId } }).then(user => {
            if (user) {
              if (code !== 3) {
                let activitesCompletes = user.completedActivities;
                console.log('ancienes activites completees avant requete : ', activitesCompletes);
                if (activitesCompletes) {
                  let id = partie.id;
                  if (!activitesCompletes.includes(id)) {
                    user
                      .update({ completedActivities: partie.id })
                      .then(USER => res.json({ msg, note: isNaN(note) ? 0 : note, reponsesValides, code, user: USER, activity: partie }));
                  } else {
                    res.json({ msg: 'activite deja completee', code: 4 });
                  }
                } else {
                  user
                    .update({ completedActivities: partie.id })
                    .then(USER => res.json({ msg, note: isNaN(note) ? 0 : note, reponsesValides, code, user: USER, activity: partie }));
                }
              } else {
                res.json({ msg, note: isNaN(note) ? 0 : note, reponsesValides, code, user: user, activity: partie });
              }
            } else {
              res.status(404).json({ msg: 'user not found' });
            }
          });
        } else {
          res.status(404).json({ msg: "aucune activite trouvee pour l'id : " + id });
        }
      }); //.catch(err=>res.status(404).json({msg : 'error occured' , err}))
    } else {
      res.status(404).json({ msg: 'id invalide : ' + id });
    }
  });
};
