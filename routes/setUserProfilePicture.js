import multer from 'multer';
import fs from 'fs';
import { User } from '../database/Sequelize.js';

export default app => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100000);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    },
  });
  const upload = multer({ storage: storage });
  app.post('/api/setuserprofilepicture', upload.single('submitProfile'), (req, res) => {
    // console.log()

    let userId = req.query.userId;
    const file = req.file || req.submitProfile;
    if (userId) {
      userId = parseInt(userId);
      User.findOne({ where: { id: userId } }).then(user => {
        if (user) {
          if (user.photo !== '') {
            let a = user.photo;
            a = a.toString().substr(a.indexOf('/public'));
            fs.unlink('.' + a, err => {
              if (err) {
                if (err.code === 'ENOENT') {
                  user.photo = 'https://autogoback237.herokuapp.com/public/images/' + req.file.filename;
                  user
                    .save()
                    .then(user2 => {
                      res.json({ msg: 'succes', url: user.photo, user2 });
                    })
                    .catch(err => res.status(500).json({ msg: 'erreur de sauvegarde ', err }));
                } else {
                  return res.status(500).json({ err });
                }
              } else {
                user.photo = 'https://autogoback237.herokuapp.com/public/images/' + req.file.filename;
                user
                  .save()
                  .then(user2 => {
                    res.json({ msg: 'succes', url: user.photo, user2 });
                  })
                  .catch(err => res.status(500).json({ msg: 'erreur de sauvegarde ', err }));
              }
            });
          } else {
            if (req.file) {
              user.photo = 'https://autogoback237.herokuapp.com/public/images/' + req.file.filename;
              user
                .save()
                .then(user2 => {
                  res.json({ msg: 'succes', url: user.photo, user2 });
                })
                .catch(err => res.status(500).json({ msg: 'erreur de sauvegarde ', err }));
            } else {
              console.log(res.file);
              console.log(file);
              res.status(500).json({ msg: 'erreure de requete' });
            }
          }
        } else {
          res.status(404).json({ msg: `user not found id = ${userId}` });
        }
      });
      // .catch(err => res.status(500).json({ msg: 'erreur de bd sur la recherche', err }));
    } else {
      res.status(404).json({ msg: 'il faut utiliser les parametres d url pour vous identifier ' });
    }
  });
};
