import { BotMessage } from "../database/Sequelize.js";

export default app => {
    app.post('/api/chatBot/message/' , (req,res)=>{
        let userId = req.body.userId
        let message = req.body.message
        if(userId){

        }else{
            if(message){
                BotMessage.findOne({where : {propositionLabel : message} , include : BotMessage}).then(reponse => {
                  if(reponse){
                    res.json({msg : 'ok, this is my response', BotResponse : reponse})  
                  }else{
                    res.status(404).json({msg : `Can't ear you well` , reponse : reponse , niveau : '1'})
                  }
                })
            }else{
                res.status(404).json({reponse : `Can't ear you well` , message : message , niveau : '2'})
            }
        }
    })
}