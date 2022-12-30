export default (app , number)=>{
    app.post('/api/verification',(req,res)=>{
        if(req.body.number === number){
            res.json({msg : 'verification Complete'})
        } 
        else {
            res.status(400).json({msg : 'verification echouee'})
        } 
    })
}
