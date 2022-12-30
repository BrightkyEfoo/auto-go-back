import {Partie} from "../database/Sequelize.js"; 
export default (app)=>{
    app.put('/api/partie/setName',(req,res)=>{
        let id = req.body.id
        let titre = req.body.titre
        Partie.findOne({where : {id : id}}).then(partie => {
            if(partie){
                partie.titre = titre
                partie.save().then(part=>res.json({msg:'nom change avec succes ' , partie : part}))
            }else{
                res.status(404).json({msg : 'aucune partie ou activite ne correspond a l\'id '+id})
            }
            
        }).catch(err=>res.status(400).json({msg : 'erreur' , err}))
    })
}