import { Theme, Chapitre } from '../database/Sequelize.js';

export default app => {
  app.post('/api/createandaddchaptotheme', (req, res) => {
    if (req.body.themeId) {
      let themeId = parseInt(req.body.themeId);
      Theme.findOne({ where: { id: themeId } })
        .then(theme => {
          if (theme) {
            if (req.body.chapitreTitre) {
              Chapitre.create({ titre: req.body.chapitreTitre })
                .then(chap => {
                  theme.addChapitre(chap)
                  .then(upDatedTheme => {
                    res.json({
                      msg: `le chapitre ${chap.titre} vient d'etre créé et ajouté au theme " ${theme.nom} " `,
                      theme: upDatedTheme,
                      chap : chap
                    })
                  }).catch(err=> res.status(406).json({msg : 'Ce titre de cours est deja pris dans le meme theme! veuillez en choisir un autre' , err}))
                })
                .catch(err => {
                  res.status(406).json({ msg: 'erreur de creation de chapitre', err });
                });
            } else {
              return res.status(404).json({ message: 'titre du chapitre absent' });
            }
          } else {
            res.status(404).json({ msg: "aucun theme correspondant a l'id " + themeId });
          }
        })
        .catch(err => res.status(500).json({ msg: 'erreur serveur', err }));
    } else {
      res.status(404).json({ message: "Vous devez fournir un id sous le format 'themeId' : id " });
    }
  });
};
