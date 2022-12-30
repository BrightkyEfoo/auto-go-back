import { dateDeLancement, days, visites } from '../index.js';
import { User } from '../database/Sequelize.js';
import { tableauSexes, tableauAges } from '../index.js';
export default app => {
  app.get('/api/visitesData', (req, res) => {
    const id = req.query.userId;
    if (!isNaN(id)) {
      User.findOne({ where: { id } }).then(user => {
        if (user) {
          if (parseInt(user.status) !== 1) {
            res.status(401).json({ msg: `l'utilisateur en cours n'est pas autorisé a acceder a cette requete` });
          } else {
            let i = 0;
            const toDay = new Date()
            const m = toDay.getMonth()
            const labels = visites.map(v => {
              const thisDay = new Date();
              //on ajoute le nombre de jours correspondants au decalage
              thisDay.setDate(dateDeLancement.getDate() + i);
              const d = thisDay.getDay();
              const j = thisDay.getDate();
              i++;
              return days[d] + ' ' + j;
            });
            const Datas = visites.map(v => parseInt(v));
            const data = {
              categories: labels,
              data: Datas,
              month : m
            };
            res.json({ data, tableauSexes, tableauAges });
          }
        } else {
          res.status(404).json({ msg: `user of id : ${id} not found` });
        }
      });
    } else {
      res.status(400).json({ msg: 'bad userId entry ' + id });
    }
  });
};
