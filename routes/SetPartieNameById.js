import { Partie } from '../database/Sequelize.js';
export default app => {
  try {
    app.put('/api/activity/setName', (req, res) => {
      let id = req.body.id;
      if (!isNaN(id)) {
        Partie.findOne({ where: { id: id } })
          .then(partie => {
            let titre = req.body.titre;
            if (partie) {
              partie.titre = titre;
              partie
                .save()
                .then(p => {
                  res.json({ msg: 'successfully change name to '+titre, partie: p });
                })
                .catch(err => res.status(404).json({ err }));
            } else {
              res.status(404).json({ msg: `Aucune activitee ne correspond a l'id ${id}` });
            }
          })
          .catch(err => res.status(404).json({ msg: 'error bad entry', err }));
      } else {
        throw new Error(`bad id provided as ${id}`);
      }
    });
  } catch {
    err => {
      res.status(404).json({ msg: `bad id provided`, err });
    };
  }
};
