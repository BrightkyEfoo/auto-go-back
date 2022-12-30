import {Chapitre , User} from '../database/Sequelize.js'
export default app=>{
    app.put('/api/chapter/completed', (req,res)=>{
        let ChapitreId = req.body.ChapitreId
        let userId = req.body.userId

        User.findOne({where : {id : userId}}).then(user => {
            if(user){
                Chapitre.findOne({where : {id : ChapitreId}}).then(chapitre=>{
                    if(chapitre){
                        let chapitresCompletes = user.completedChapters
                        console.log( 'ancien chapitres completees avant requete : ',chapitresCompletes)
                        if(chapitresCompletes){
                            let id = chapitre.id
                            if(!chapitresCompletes.includes(id)){
                                user.update({completedChapters : chapitre.id}).then(USER => res.json({msg : 'succesfully update' , user :USER , chapter : chapitre}))
                            }else{
                                res.json({msg : 'chapitre deja completee'})
                            }
                        }else{
                            user.update({completedChapters : chapitre.id}).then(USER => res.json({msg : 'succesfully update' , user :USER , chapter : chapitre}))
                        }
                    }else{
                        res.status(404).json({msg : 'chapter not found for id : '+ChapitreId})
                    }
                }).catch(err => res.status(404).json({msg : 'error occured invalid ChapterID : '+ChapitreId , err}))
            }else{
                res.status(404).json({msg : 'user not found for id :'+userId})  // meme comme la jwt va empecher que ca arrive ici 
            }
        }).catch(err=>{
            res.status(404).json({msg : 'error occured invalid userID' , err})
        })
    })
}