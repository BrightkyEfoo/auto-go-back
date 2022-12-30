import multer from 'multer';
import fs from 'fs';
import { User } from '../database/Sequelize.js';

export default app => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/lecon');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100000);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    },
  });
  const upload = multer({ storage: storage });
  
  app.post('/api/picture/lecon', upload.single('file'), (req, res) => {
    // console.log('req.file : ',req.file)
    // console.log('req.body : ' ,req.body)
    const file = req.file 
    if(file){
    res.json({url : 'https://autogoback237.herokuapp.com/public/lecon/' + req.file.filename , name : req.file.filename})
    }else{
      res.status(404).json({msg : 'upload failed'})
    }
  })

 
};
