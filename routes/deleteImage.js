import fs from 'fs'

export default app=>{
    app.delete('/api/picture' , (req,res)=>{
        let a = req.body.url;
        a = a.substr(a.indexOf('/public'));
        console.log('a', a)
        if(a){
          fs.unlink('./'+a , err=>{
            if(err){
              if(err.code === 'ENOENT'){
                res.status(404).json({msg : 'no such file' , err})
              }else{
                res.status(500).json({msg: 'something went wrong', err})
              }
            }else{
                res.json({msg : 'successfully deleted'})
            }
          })
        }else{
          res.status(404).json({msg : `veuillez fournir l'image a supprimer via son url sous le format : 'url' : imageUrl` })
        }
      })
}