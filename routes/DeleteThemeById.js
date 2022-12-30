import { Theme } from "../database/Sequelize.js";
export default (app) => {
  app.delete("/api/theme/delete", (req, res) => {
    let id = req.body.id
    Theme.findOne({where : {id : id}}).then(theme=>{
        if(theme){
            theme.destroy().then(t=>{
            res.json({msg : 'suppression effectuee' , theme : t})
        }).catch(err=>{
            return new Error({msg : 'erreure de suppression' , err})
        })
    }else{
        res.status(404).json({msg : 'aucun theme correspondant'})
    }
    }).catch(err => res.status(404).json({msg : 'erreur bd' , err}) )
  });
};