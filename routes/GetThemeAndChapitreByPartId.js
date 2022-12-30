import {Chapitre , Partie , Theme} from '../database/Sequelize.js'
export default app => {
    app.get('/api/activite/full',(req ,res)=>{
        let id = parseInt(req.query.id)
        Partie.findOne({where : {id : id} , include : Chapitre}).then(partie => {
            if(partie){
            Chapitre.findOne({where : {id : partie.ChapitreId} , include : Theme}).then(chapitre => {
                let obj = partie
                res.json({partie , chapitre})
            })
        }else{
            res.status(404).json({msg : 'aucune activite correspondante'})
        }
            // res.json({activite : partie})
        })
    })
}