import { Chapitre } from "../database/Sequelize.js"; 
export default (app)=>{
    app.put('/api/chapitre/setName', (req,res)=>{
        let id = req.body.id
        let titre = req.body.titre
        Chapitre.findOne({where : {id : id}}).then(chapitre => {
            if(chapitre){
                chapitre.titre = titre
                chapitre.save().then(chap=> res.json({msg : 'changement de nom effectue avec succes ' , chapitre : chap}))
            }else{
                res.status(404).json({msg:'aucun chapitre ne correspond a l\'id '+id})
            }
        })
    })
}