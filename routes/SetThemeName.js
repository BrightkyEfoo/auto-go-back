import { Theme } from "../database/Sequelize.js"; 
export default (app)=>{
    app.put('/api/theme/setName', (req,res)=>{
        let id = req.body.id
        let nom = req.body.nom
        Theme.findOne({where : {id : id}}).then(theme => {
            if(theme){
                theme.nom = nom
                theme.save().then(t=> res.json({msg : 'changement de nom effectue avec succes ' , theme : t}))
            }else{
                res.status(404).json({msg:'aucun theme ne correspond a l\'id '+id})
            }
        })
    })
}