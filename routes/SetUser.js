import {User } from "../database/Sequelize.js";
export default (app) => {
  app.put("/api/setuser", (req, res) => {
    const userId = req.body.id
    User.update(req.body,{where :{id:userId}}).then((_)=>{
        res.json({msg : `l'utilisateur ${req.body.name} a bien ete modifie`,data:req.body})
    }).catch(err=> res.status(400).json({msg:'Erreur' , err}))
  });
};
