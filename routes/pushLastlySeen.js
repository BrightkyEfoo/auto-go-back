import {User , Partie} from '../database/Sequelize.js' 

export default app => {
    app.post('/api/lastseen/setbyid/',(req,res)=>{
        let partieId = req.body.partieId
        let userId = req.body.userId
        User.findOne({where : {id : userId}}).then(user => {
            if(user){
                Partie.findByPk(partieId).then(partie => {
                    if(partie){
                        if(parseInt(user.lastSeen[4])===parseInt(partie.id)||parseInt(user.lastSeen[3])===parseInt(partie.id)){
                            res.status(304).json({msg : `vu dernierement l'id ${partieId}`})
                        }else{
                            user.lastSeen = partie.id
                            user.save().then(u => res.json({user : u}))
                        } 
                    }else{
                        res.status(404).json({msg : `aucune partie correspondant a l'id ${partieId}`})
                    }
                })
            }else{
                res.status(404).json({msg : `Aucun utilisateur trouvé pour l'id ${userId}`})
            }
        })
    })
}