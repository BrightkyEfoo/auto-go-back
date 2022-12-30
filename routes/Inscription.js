import { User, WebsiteStats } from '../database/Sequelize.js';
import jwt from 'jsonwebtoken';
import { private_key } from '../auth/private_key.js';
import { io, onlineUsers, visitesDuJour } from '../index.js';
export default app => {
  app.post('/api/inscription', (req, res) => {
    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user) {
        res.status(400).json({ msg: 'cet email est deja pris', email: req.body.email });
      } else {
        User.create(req.body).then(user => {
          const token = jwt.sign({ userId: user.id }, private_key, { expiresIn: '24h' });
          user.online = 1;
          if (onlineUsers.filter(u => u.id === user.id).length === 0) {
            let a = user.dataValues;
            delete a.password;
            console.log('a', a)
            onlineUsers.push(a);
          }
          console.log('onlineUsers :', onlineUsers);
          WebsiteStats.findByPk(1).then(stats => {
            stats.visites++;
            visitesDuJour[0]++
            stats.save().then(err =>
              user.save().then(err2 => {
                io.emit('userList', onlineUsers);
                res.json({ msg: 'user created succesfully', user, token });
              })
            );
          });
        });
      }
    });
  });
};

// async..await is not allowed in global scope, must use a wrapper
