import { Partie, Chapitre } from '../database/Sequelize.js';

export default app => {
  app.post('/api/createandaddparttochap', (req, res) => {
    if (req.body.chapitreId) {
      let chapId = req.body.chapitreId;
      Chapitre.findOne({ where: { id: chapId } })
        .then(chap => {
          if (chap) {
            if (req.body.activiteTitre) {
              let activite ={ 
                titre : req.body.activiteTitre,
                contenu : req.body.contenu,
                genre : req.body.genre,
                preview : req.body.preview
              }
              Partie.create(activite)
                .then(partie => {
                  chap.addPartie(partie)
                  .then(upDatedChap => {
                    res.json({
                      msg: `${ partie.genre === 'quizz' ? 'le quizz ': 'la lecon '} ${partie.titre} vient d'etre créé et ajouté au chapitre ${upDatedChap.titre} `,
                      chap: upDatedChap,
                      partie : partie
                    });
                  })
                  .catch(err => res.status(406).json({msg : 'ce nom est deja pris par une autre activite du meme genre dans le meme chapitre' , err}))
                  
                })
                .catch(err => {
                  res.status(406).json({ msg: 'erreur de creation d\' activité', err });
                });
            } else {
              return res.status(404).json({ message: 'titre de l\'activité absent' });
            }
          } else {
            res.status(404).json({ msg: "aucune chapitre correspondant a l'id " + chapId });
          }
        })
        .catch(err => res.status(500).json({ msg: 'erreur serveur', err }));
    } else {
      res.status(404).json({ message: "Vous devez fournir un id sous le format 'chapitreId' : id " });
    }
  });
};
