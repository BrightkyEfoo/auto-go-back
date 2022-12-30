import { Theme, Chapitre } from "../database/Sequelize.js";
export default (app) => {
  app.get("/api/getthemechap", (req, res) => {
    if (req.query.id) {
        const id= parseInt(req.query.id)
      Theme.findOne({where : {id : id} , include : Chapitre  }).then(theme => {
        res.json({msg : 'resultats' , theme})
    })
    }else{
        res.status(404).json({msg:'veuillez fournir des paramettre dans l\'url'})
    }
  });
};
