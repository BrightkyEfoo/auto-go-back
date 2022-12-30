import { User, Theme } from '../database/Sequelize.js';
import { Op } from 'sequelize';
export default app => {
  app.post('/api/users', (req, res) => {
    let emailOrUser = req.body.emailOrUser
    User.findAll({where : {email : emailOrUser}}).then(user => {
      if(user){
        res.status(404).json({msg : 'email deja pris'})
      }else{
        User.findAll({where : {phone : emailOrUser}}).then(uses => {
          if(uses){
            res.status(404).json({msg : 'numero deja pris'})
          } else{
            res.json({})
          }
        })
      }
    })
  })
};
