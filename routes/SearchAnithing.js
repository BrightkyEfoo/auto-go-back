import {Chapitre , Partie , Theme} from '../database/Sequelize.js'
import {Op} from 'sequelize'

export default app => {
    app.get('/api/search' , async (req,res)=>{
        let search = req.query.nom || req.body.nom
        if(search.length > 3){
            Theme.findAll({where : {nom : {[Op.substring]: search}}}).then(themes => {

                Chapitre.findAll({where : {titre : {[Op.substring]: search}}}).then(chaps => {

                    Partie.findAll({where : {titre : {[Op.substring]: search}}}).then(parties => {
                        res.json({msg : 'liste recuperee' ,themes , chapitres : chaps , activites : parties})
                    }).catch(err => res.json({msg : 'erreur liee a la table des activites' , err}))
                }).catch(err => res.json({msg : 'erreur liee a la table des chapitres' , err}))
            }).catch(err => res.json({msg : 'erreur liee a la table des themes' , err}))
        }else{
            res.status(404).json({msg : 'il faut au moins 3 lettres'})
        }
    })
}