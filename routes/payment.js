// import { io } from "../index.js"
export let code = 0
export default app => {
    app.post('/api/payment',(req,res)=>{
        let code = req.body.code
        res.json({msg:`requete de payement pour le code ${req.body.code} a debuté `})
    })
}