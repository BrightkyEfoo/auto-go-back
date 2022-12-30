import {Partie , User} from '../database/Sequelize.js'
export default app=>{
    app.put('/api/activity/completed', (req,res)=>{
        let activityId = req.body.activityId
        let userId = req.body.userId
        User.findOne({where : {id : userId}}).then(user => {
            if(user){
                Partie.findOne({where : {id : activityId}}).then(partie=>{
                    if(partie){
                        let activitesCompletes = user.completedActivities
                        console.log( 'ancienes activites completees avant requete : ',activitesCompletes)
                        if(activitesCompletes){
                            let id = partie.id
                            if(!activitesCompletes.includes(id)){
                                user.update({completedActivities : partie.id}).then(USER => res.json({msg : 'succesfully update' , user :USER , activity : partie}))
                            }else{
                                res.json({msg : 'activite deja completee'})
                            }
                        }else{
                            user.update({completedActivities : partie.id}).then(USER => res.json({msg : 'succesfully update' , user :USER , activity : partie}))
                        }
                    }else{
                        res.status(404).json({msg : 'activity not found for id : '+activityId})
                    }
                }).catch(err=>{
                    res.status(404).json({msg : 'error occured' , err})
                })
            }else{
                res.status(404).json({msg : 'user not found for id :'+userId})  // meme comme la jwt va empecher que ca arrive ici 
            }
        }).catch(err=>{
            res.status(404).json({msg : 'error occured' , err})
        })
    })
}