import multer from 'multer';
import fs from 'fs';
import { User } from '../database/Sequelize.js';

export default app => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/quizz');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100000);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    },
  });
  const upload = multer({ storage: storage });
  
  app.post('/api/picture', upload.single('addImage'), (req, res) => {
    const file = req.file || req.addImage;
    if(file){
    res.json({url : 'https://autogoback237.herokuapp.com/public/quizz/' + req.file.filename})
    }else{
      res.status(404).json({msg : 'upload failed'})
    }
  })

 
};
