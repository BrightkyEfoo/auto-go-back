import { Theme, User } from '../database/Sequelize.js';
export default app => {
  app.post('/api/createtheme', (req, res) => {
    const nom = req.body.nom;
    const userId = req.body.userId;
    User.findOne({ where: { id: userId } }).then(user => {
      if (user) {
        Theme.findOne({ where: { nom: nom } })
          .then(theme => {
            if (theme) {
              res.status(400).json({ msg: 'ce nom es deja pris' });
            } else {
              Theme.create({ nom : nom })
                .then(createdTheme => {
                    user.addTheme(createdTheme).then(data => {
                        res.json({msg : 'effectue avec succes ' , createdTheme , user : {nom : user['nom'] , prenom : user['prenom']}})
                    })
                })
                .catch(err => res.status(400).json({ msg: 'mauvaise entree', err }));
            }
          })
          .catch(err => res.status(503).json({ msg: 'bd error' , err }));
      }else{
        res.status(404).json({msg : 'aucun utilisateur en cours trouve'})
      }
    });
  });
};
