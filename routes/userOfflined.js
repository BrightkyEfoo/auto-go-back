import { User } from '../database/Sequelize.js';
import { io, onlineUsers } from '../index.js';
export default app => {
  app.post('/api/offlined', (req, res) => {
    let userId = req.body.userId;
    User.findOne({ where: { id: userId } }).then(user => {
      if (user) {
        if (onlineUsers.filter(u => u.id === user.id).length !== 0) {
          onlineUsers.splice(onlineUsers.indexOf(onlineUsers.filter(u => u.id === user.id)[0]), 1);
          io.emit('userList', onlineUsers);
          console.log('onlineUsers :', onlineUsers);
        }

        user.online = 0;
        user.save().then(() => res.json({}));
      } else {
        res.json({});
      }
    });
  });
};
