import { Chapitre, Partie } from "../database/Sequelize.js";
export default (app) => {
  app.get("/api/getchapactivities", (req, res) => {
    if (req.query.id) {
        const id= parseInt(req.query.id)
      Chapitre.findOne({where : {id : id} , include : Partie  }).then(chap => {
        res.json({msg : 'resultats' , chap})
    })
    }else{
        res.status(404).json({msg:'veuillez fournir des paramettre dans l\'url'})
    }
  });
};
