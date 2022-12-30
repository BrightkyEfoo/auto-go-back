import multer from 'multer';
import fs from 'fs';
import { Theme } from '../database/Sequelize.js';

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
  app.post('/api/setthemepicture', upload.single('submitThemePicture'), (req, res) => {
    // console.log()

    let themeId = req.query.id;
    const file = req.file || req.submitThemePicture;
    if (themeId) {
      themeId = parseInt(themeId);
      Theme.findByPk(themeId).then(theme => {
        if (theme) {
          if (theme.img !== '') {
            let a = theme.img;
            // console.log(a)
            // let i = a.indexOf('/public')
            a = a.toString().substr(a.indexOf('/public'));
            fs.unlink('.' + a, err => {
              if (err) {
                if (err.code === 'ENOENT') {
                  theme.img = 'https://autogoback237.herokuapp.com/public/images/' + req.file.filename;
                  theme
                    .save()
                    .then(theme2 => {
                      res.json({ msg: 'succes', url: theme.img, theme2 });
                    })
                    .catch(err => res.status(500).json({ msg: 'erreur de sauvegarde ', err }));
                } else {
                  return res.status(500).json({ err });
                }
              } else {
                theme.img = 'https://autogoback237.herokuapp.com/public/images/' + req.file.filename;
                theme
                  .save()
                  .then(theme2 => {
                    res.json({ msg: 'succes', url: theme.img, theme2 });
                  })
                  .catch(err => res.status(500).json({ msg: 'erreur de sauvegarde ', err }));
              }
            });
          } else {
            if (req.file) {
              theme.img = 'https://autogoback237.herokuapp.com/public/images/' + req.file.filename;
              theme
                .save()
                .then(theme2 => {
                  res.json({ msg: 'succes', url: theme.img, theme2 });
                })
                .catch(err => res.status(500).json({ msg: 'erreur de sauvegarde ', err }));
            } else {
              console.log(res.file);
              console.log(file);
              res.status(500).json({ msg: 'erreure de requete' });
            }
          }
        } else {
          res.status(404).json({ msg: `theme not found id = ${themeId}` });
        }
      });
      // .catch(err => res.status(500).json({ msg: 'erreur de bd sur la recherche', err }));
    } else {
      res.status(404).json({ msg: 'il faut utiliser les parametres d url pour vous identifier ' });
    }
  });
};
