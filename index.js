import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { Examen, ExamenMultimedia, ExamenQuestion, ExamenReponses, initDb, Theme, User } from './database/Sequelize.js';
import Connexion from './routes/Connexion.js';
import Inscription from './routes/Inscription.js';
import SetUser from './routes/SetUser.js';
import auth from './auth/auth.js';
import CryptoJS from 'crypto-js';
import 'dotenv/config';
import cors from 'cors';
import GetUser from './routes/GetUser.js';
import passport from 'passport';
import PassportConfig from './Passport/Passport-config.js';
import EventEmitter from 'events';
import CreateTheme from './routes/CreateTheme.js';
import GetThemeChap from './routes/GetThemeChap.js';
import GetChapitrePart from './routes/GetChapitrePart.js';
import CreateAndAddChapToTheme from './routes/CreateAndAddChapToTheme.js';
import CreateAndAddPartToChap from './routes/CreateAndAddPartToChap.js';
import SetThemeName from './routes/SetThemeName.js';
import SetPartsName from './routes/SetPartsName.js';
import SetChapterName from './routes/SetChapterName.js';
import DeleteChap from './routes/DeleteChap.js';
import DeleteThemeById from './routes/DeleteThemeById.js';
import DeleteActivityById from './routes/DeleteActivityById.js';
import SetPartieNameById from './routes/SetPartieNameById.js';
import getChapByPartId from './routes/getChapByPartId.js';
import GetThemeAndChapitreByPartId from './routes/GetThemeAndChapitreByPartId.js';
import setActivityComplete from './routes/setActivityComplete.js';
import getChapById from './routes/getChapById.js';
import SearchAnithing from './routes/SearchAnithing.js';
import setUserProfilePicture from './routes/setUserProfilePicture.js';
import setChapterComplete from './routes/setChapterComplete.js';
import setThemePicture from './routes/setThemePicture.js';
import addImageToServer from './routes/addImageToServer.js';
import deleteImage from './routes/deleteImage.js';
import VerifyResponsesForQuizzById from './routes/VerifyResponsesForQuizzById.js';
import userOfflined from './routes/userOfflined.js';
import { WebsiteStats } from './database/Sequelize.js';
import pushLastlySeen from './routes/pushLastlySeen.js';
import http from 'http';
import { Server } from 'socket.io';
import submitPhotosForLecons from './routes/submitPhotosForLecons.js';
import getVisitesDatas from './routes/getVisitesDatas.js';
import payment, { code } from './routes/payment.js';
import AUserVisited from './routes/AUserVisited.js';
import WriteToChatBot from './routes/WriteToChatBot.js';
import examen from './routes/examen/examen.js';
import addMedia from './routes/examen/addMedia.js';
import createExamen from './routes/examen/createExamen.js';
import getScores from './routes/getScores.js';
import scoreTestExam from './routes/scoreTestExam.js';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
// increase the limit
myEmitter.setMaxListeners(20);

//configuring passport
PassportConfig(passport);
const app = express();
const port = process.env.PORT || 9000;
export let onlineUsers = [];
export let visitesDuJour = [0];
export let visites = [];
export let tableauAges = [];
export const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
// export const months = ['Jan',]
export const tableauSexes = [0, 0];
export const dateDeLancement = new Date();

console.log('dateDeLancement', dateDeLancement.getUTCMonth());
const App = http.createServer(app);
export const io = new Server(App, {
  cors: {
    origins: '*',
  },
});

let emailVerificationNUmber = 0;
app
  .use(
    cors({
      origin : '*'
    })
  )
  .use('/public', express.static('public'))
  .use(bodyParser.json())
  .use(morgan('dev'));

initDb();

app.get('/', (req, res) => {
  res.send('got access');
});
app.get('/public');
// app.get('/favicon.ico')

// debut des routes pour authentification google
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
// Retrieve user data using the access token received
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  let encryptedPass = CryptoJS.AES.encrypt(
    req.user.password,
    'SUPER_SUPER_SECRET_KEY_@@@@@4785525_BRIGHTMAN_CRAQUEZ CA JE VOIS BANDE DE CHIENS LOOOOOOOOOLLLLLL!!!!!!!!!!'
  ).toString();
  encryptedPass = encryptedPass.toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
  res.redirect('http://auto-go.herokuapp.com/account/' + req.user.email + ',' + encryptedPass);
});

//fin de l'authentification google il reste a ajouter l'envoi de la fiche d'informations via mail.

setInterval(() => {
  visites.push(visitesDuJour[0]);
  visitesDuJour[0] = 0;
  let i = 0;
  const toDay = new Date();
  const labels = visites.map(v => {
    const thisDay = new Date();
    //on ajoute le nombre de jours correspondants au decalage
    thisDay.setDate(dateDeLancement.getDate() + i);
    const d = thisDay.getDay();
    const j = thisDay.getDate();
    i++;
    return days[d] + ' ' + j;
  });
  const m = toDay.getMonth();
  const Datas = visites.map(v => parseInt(v));
  const data = {
    categories: labels,
    data: Datas,
    month: m,
  };
  if (visites.length === 30) {
    WebsiteStats.create({
      visites: JSON.stringify(visites),
    }).then(() => {
      visites = [];
    });
  }
  io.emit('visiteChart', data);
}, 86400000);

// 86400000


app.post('/api/payment/succes', (req, res) => {
  let id = req.body.userId;
  let code = parseInt(req.body.code);
  User.findOne({ where: { id: id } }).then(user => {
    if (user) {
      if (code === 1) {
        Theme.findAll().then(themes => {
          themes.forEach(t => {
            user.addTheme(t);
          });
        });
      } else if (code === 2) {
        Theme.findAll().then(themes => {
          let ths = themes;
          ths.shift();
          ths.forEach(t => {
            user.addTheme(t);
          });
        });
      }
      io.emit('resultats paiements', {
        code,
        state: 'fulfilled',
        userId: user.id,
      });
      res.json({ msg: `requete de succes de paiment vient d'etre effectuee` });
    } else {
      res.json({ msg: 'aucun utilisteur trouvé' });
    }
  });
});
app.post('/api/payment/error', (req, res) => {
  let id = req.body.userId;
  let code = req.body.code;
  io.emit('resultats paiements', {
    code,
    userId: id,
    state: 'rejected',
  });
  res.json({ msg: `requete d'echec de paiment vient d'etre effectuee` });
});

Connexion(app);
Inscription(app);
AUserVisited(app);
WriteToChatBot(app)

app.use(auth);
payment(app);
SetUser(app);
GetUser(app);
CreateTheme(app);
GetThemeChap(app);
GetChapitrePart(app);
CreateAndAddChapToTheme(app);
CreateAndAddPartToChap(app);
SetThemeName(app);
SetPartsName(app);
SetChapterName(app);
DeleteChap(app);
DeleteThemeById(app);
DeleteActivityById(app);
SetPartieNameById(app);
getChapByPartId(app);
GetThemeAndChapitreByPartId(app);
setActivityComplete(app);
getChapById(app);
SearchAnithing(app);
setUserProfilePicture(app);
setChapterComplete(app);
setThemePicture(app);
addImageToServer(app);
deleteImage(app);
VerifyResponsesForQuizzById(app);
userOfflined(app);
pushLastlySeen(app);
submitPhotosForLecons(app);
getVisitesDatas(app);
examen(app)
addMedia(app)
createExamen(app)
getScores(app)
scoreTestExam(app)
// chat bot GrandProf

const discutionList = [
  {
    id: 0,
    discussion: [
      {
        type: 1, // 1 bot 0 client
      },
    ],
  },
];




//end chat bot




App.listen(port, () => console.log(`notre application tourne sur l'adresse http://localhost:${port}`));
