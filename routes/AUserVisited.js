import { visitesDuJour } from "../index.js"

export default app=>{
    let idPrecedent = -1
    app.post('/api/visited' , (req,res)=>{
        let idActuel = req.body.id
        if(idActuel === idPrecedent){
            res.status(304).json({msg : 'deja connecte'})
        }else{
            visitesDuJour[0]++
            res.json({msg : 'vous vennez de visiter'})
        }
        idPrecedent = idActuel
    })
}