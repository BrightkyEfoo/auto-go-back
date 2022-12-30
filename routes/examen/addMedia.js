import multer from 'multer';
import { ExamenMultimedia } from '../../database/Sequelize.js';

export default app => {
  const storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/examen/image');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100000);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    },
  });
  const storageVideo = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/examen/video');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100000);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    },
  });
  const storageAudio = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/examen/music');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100000);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    },
  });
  const uploadImage = multer({ storage: storageImage });
  const uploadVideo = multer({ storage: storageVideo });
  const uploadAudio = multer({ storage: storageAudio });

  app.post('/api/examenMedia/image', uploadImage.single('head'), (req, res) => {
    const file = req.file || req.addImage;
    if (file) {
      ExamenMultimedia.create({
        link: 'https://autogoback237.herokuapp.com/public/examen/image/' + req.file.filename,
        type: 'IMAGE',
      })
        .then(media => {
          res.json({ media });
        })
        .catch(err => {
          res.status(500).json({ msg: err.message, err });
        });
    } else {
      res.status(404).json({ msg: 'upload failed' });
    }
  });
  app.post('/api/examenMedia/video', uploadVideo.single('head'), (req, res) => {
    const file = req.file || req.addImage;
    if (file) {
        ExamenMultimedia.create({
            link: 'https://autogoback237.herokuapp.com/public/examen/video/' + req.file.filename,
            type: 'VIDEO',
          })
            .then(media => {
              res.json({ media });
            })
            .catch(err => {
              res.status(500).json({ msg: err.message, err });
            });
    } else {
      res.status(404).json({ msg: 'upload failed' });
    }
  });
  app.post('/api/examenMedia/audio', uploadAudio.single('audio'), (req, res) => {
    const file = req.file || req.addImage;
    if (file) {
        ExamenMultimedia.create({
            link: 'https://autogoback237.herokuapp.com/public/examen/music/' + req.file.filename,
            type: 'AUDIO',
          })
            .then(media => {
              res.json({ media });
            })
            .catch(err => {
              res.status(500).json({ msg: err.message, err });
            });
    } else {
      res.status(404).json({ msg: 'upload failed' });
    }
  });
  // app.delete('/api/examenMedia/audio',(req,res)=>{
  //   ExamenMultimedia.findOne({where : {link : req.query.link}}).then()
  // })
};
