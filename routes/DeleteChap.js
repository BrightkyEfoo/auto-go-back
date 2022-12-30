import { Chapitre } from "../database/Sequelize.js"; 
export default (app)=>{
    app.delete('/api/chapitre/delete', (req,res)=>{
        let id = req.body.id
        if(!isNaN(parseInt(id))){
        Chapitre.findByPk( id).then(chapitre => {
            if(chapitre){
                chapitre.destroy().then(chap=> res.json({msg : 'suppression effectue avec succes ' , chapitre : chap}))
            }else{
                res.status(404).json({msg:'aucun chapitre ne correspond a l\'id '+id})
            }
        })
    }else{
        res.status(404).json({msg : 'veuillez saisir un bon id'})
    }
    })
}