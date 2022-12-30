import {Chapitre , Partie} from '../database/Sequelize.js'
export default app => {
    app.get('/api/activite',(req ,res)=>{
        let id = parseInt(req.query.id)
        Partie.findOne({where : {id : id} , include : Chapitre}).then(partie => {
            res.json({activite : partie})
        })
    })
}