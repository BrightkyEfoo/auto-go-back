import { Chapitre , Theme } from '../database/Sequelize.js';

export default app => {
  app.get('/api/chapitre', (req, res) => {
    if (req.query.id) {
      let id = parseInt(req.query.id);
      if (!isNaN(id) || id <= 0) {
        Chapitre.findOne({ where: { id: id } , include : Theme }).then(chap => res.json({msg : 'chap trouve ' , chapitre : chap}))
      } else {
        res.status(404).json({ msg: `l'id d'un chapitre doit forcement etre un entier positif non nul ` });
      }
    } else {
      res.status(404).json({ msg: "utilisez les parametres d'id   >>>>?id=<<<<" });
    }
  });
};
