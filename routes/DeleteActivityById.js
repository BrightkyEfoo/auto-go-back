import { Partie } from '../database/Sequelize.js'
export default (app)=>{
    app.delete('/api/activity/delete',(req,res)=>{
        let id = parseInt(req.body.id)
        Partie.findOne({where : {id : id}}).then(partie => {
            if(partie){
                partie.destroy().then(p => {
                    res.json({msg : `activité supprimee avec succes ` , partie : p})
                })
            }else{
                res.status(404).json({msg : `Aucune activité correspondant a l'id ${id}`})
            }
        }).catch(err => {
            res.status(404).json({msg : 'erreur' , err})
        })
    })
}