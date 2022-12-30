import { Sequelize, DataTypes } from 'sequelize';
import { UserModel } from '../models/UserModel.js';
import { PartieModel } from '../models/PartieModel.js';
import { ChapitreModel } from '../models/ChapitreModel.js';
import { ThemeModel } from '../models/ThemeModel.js';
import { WebsiteStatsModel } from '../models/WebsiteStatsModel.js';
import { io, tableauAges, tableauSexes } from '../index.js';
import { BotMessageModel } from '../models/BotMessage.js';
import { ExamenMultimediaModel } from '../models/Examen/ExamenMultimedia.js';
import { ExamenReponsesModel } from '../models/Examen/ExamenReponses.js';
import { ExamenQuestionModel } from '../models/Examen/ExamenQuestion.js';
import { ExamenModel } from '../models/Examen/Examen.js';
import { GrandProfUserConnectedMessage1, GrandProfUserConnectedMessage2, GrandProfUserConnectedMessage3 } from './GrandProf.js';
import { ExamenScoreModel } from '../models/ExamenScoreModel.js';
// import { UserToThemeModel } from '../models/UserToThemeModel.js';

const sequelize = new Sequelize('autogo', 'root', '123456789', {
  // host: 'localhost',
  host: 'mariadb-95506-0.cloudclusters.net',
  port:10023,
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT+1',
  },
  logging: false,
});

export const UserToTheme = sequelize.define(
  'UserToTheme',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    ThemeId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
    createdAt: 'created',
    updatedAt: false,
  }
);

// export const UserToTheme = UserToThemeModel(sequelize, DataTypes);

export const User = UserModel(sequelize, DataTypes);
export const Partie = PartieModel(sequelize, DataTypes);
export const Chapitre = ChapitreModel(sequelize, DataTypes);
export const Theme = ThemeModel(sequelize, DataTypes);
export const WebsiteStats = WebsiteStatsModel(sequelize, DataTypes);
export const BotMessage = BotMessageModel(sequelize, DataTypes);
export const Examen = ExamenModel(sequelize, DataTypes);
export const ExamenMultimedia = ExamenMultimediaModel(sequelize, DataTypes);
export const ExamenReponses = ExamenReponsesModel(sequelize, DataTypes);
export const ExamenQuestion = ExamenQuestionModel(sequelize, DataTypes);
export const ExamenScore = ExamenScoreModel(sequelize, DataTypes);

User.addHook('afterCreate', (user, options) => {
  if (user.sexe === 'M') {
    tableauSexes[0]++;
  } else {
    tableauSexes[1]++;
  }
  io.emit('sexeDonut', tableauSexes);
  let dateActuele = new Date();
  let age = dateActuele.getFullYear() - parseInt(user.birthDate.substr(0, 4));
  if (tableauAges.filter(t => t.tranche[0] <= age && t.tranche[1] > age)[0]) {
    tableauAges.filter(t => t.tranche[0] <= age && t.tranche[1] >= age)[0].nombre++;
  } else {
    let firstRange = Math.floor(age / 10);
    firstRange = firstRange * 10;
    tableauAges.push({
      tranche: [firstRange, firstRange + 9],
      nombre: 1,
    });
  }
  io.emit('ageDonut', tableauAges);
});

User.belongsToMany(Theme, { through: UserToTheme });
Theme.belongsToMany(User, { through: UserToTheme });

//BotMessage Message (1,1) ----> (1,n)

BotMessage.hasMany(BotMessage);
// BotMessage.belongsTo(BotMessage);

// BotMessage.belongsToMany(BotMessage , {through : })
//--- chapitre (1:1)---->(1:n) partie
Chapitre.hasMany(Partie);
Partie.belongsTo(Chapitre);

//--- theme (1:1)---->(1:n) chapitre
Theme.hasMany(Chapitre);
Chapitre.belongsTo(Theme);

//examens
ExamenQuestion.hasMany(ExamenReponses, { as: 'reponses' });
// ExamenReponses.belongsTo(ExamenQuestion , {as : 'question'})
ExamenQuestion.hasOne(ExamenReponses, { as: 'valide' });
// ExamenReponses.belongsTo(ExamenQuestion , {as : 'question' })
ExamenQuestion.hasOne(ExamenMultimedia, { as: 'audio' });
ExamenQuestion.hasOne(ExamenMultimedia, { as: 'head' });
Examen.hasMany(ExamenQuestion, { as: 'questions' });


// ExamenScore (1 : 1) -----> Examen
ExamenScore.belongsTo(Examen)


//user (1 : 1) ------> (0: n) ExamenScore
User.hasMany(ExamenScore)

export const initDb = () => {
  return sequelize
    .sync({ force: true })
    .then(_ => {
      Examen.create({
        title: 'exam1',
        type : 'EXAMEN',
        tags : `["",["essai"],["","tag"],["","panneaux"],["","signalisations"],["","local"]]`,
        description : `ceci est un test d'entrainement digne des plus grands conducteurs du monde....`
      }).then(examen => {
        ExamenQuestion.create({
          title: 'est ce que c est alors bien',
        }).then(question => {
          examen.addQuestion(question);
          ExamenMultimedia.create({
            type: 'AUDIO',
            link: 'https://autogoback237.herokuapp.com/public/examen/music/song0.mp3',
          }).then(audio => {
            question.setAudio(audio);
          });
          ExamenMultimedia.create({
            type: 'IMAGE',
            link: 'https://autogoback237.herokuapp.com/public/examen/image/img0.png',
          }).then(image => {
            question.setHead(image);
          });
          ExamenReponses.create({
            title: 'oui',
          }).then(reponse => {
            question.addReponse(reponse);
          });
          ExamenReponses.create({
            title: 'non',
          }).then(reponse => {
            question.addReponse(reponse);
            question.setValide(reponse);
          });
          ExamenReponses.create({
            title: 'peut etre',
          }).then(reponse => {
            question.addReponse(reponse);
          })
          ExamenReponses.create({
            title: 'je ne sais pas',
          }).then(reponse => {
            question.addReponse(reponse);
          });
        });
        
        ExamenQuestion.create({
          title: 'De quel generique sagit il ?',
        }).then(question => {
          examen.addQuestion(question);
          ExamenMultimedia.create({
            type: 'AUDIO',
            link: 'https://autogoback237.herokuapp.com/public/examen/music/song1.mp3',
          }).then(audio => {
            question.setAudio(audio);
          });
          ExamenMultimedia.create({
            type: 'VIDEO',
            link: 'https://autogoback237.herokuapp.com/public/examen/video/vid1.mp4',
          }).then(image => {
            question.setHead(image);
          });
          ExamenReponses.create({
            title: 'connan l avanturier',
          }).then(reponse => {
            question.addReponse(reponse);
          });
          ExamenReponses.create({
            title: 'olivier atom',
          }).then(reponse => {
            question.addReponse(reponse);
          });
          ExamenReponses.create({
            title: 'Zorro',
          }).then(reponse => {
            question.addReponse(reponse);
          });
          ExamenReponses.create({
            title: 'Ken le survivant',
          }).then(reponse => {
            question.addReponse(reponse);
            question.setValide(reponse);
          });
        });
      });



      Examen.create({
        title: 'entrainement1',
        type : 'TEST',
        tags : `["",["essai"],["","tag"],["","panneaux"],["","signalisations"],["","local"]]`,
        description : `ceci est un test d'entrainement digne des plus grands conducteurs du monde....`
      }).then(examen => {
        ExamenQuestion.create({
          title: `C'est quoi sur la photo`,
        }).then(question => {
          examen.addQuestion(question);
          ExamenMultimedia.create({
            type: 'AUDIO',
            link: 'https://autogoback237.herokuapp.com/public/examen/music/song2.mp3',
          }).then(audio => {
            question.setAudio(audio);
          });
          ExamenMultimedia.create({
            type: 'VIDEO',
            link: 'https://autogoback237.herokuapp.com/public/examen/video/vid3.mp4',
          }).then(image => {
            question.setHead(image);
          });
          ExamenReponses.create({
            title: 'oui',
          }).then(reponse => {
            question.addReponse(reponse);
          });
          ExamenReponses.create({
            title: 'non',
          }).then(reponse => {
            question.addReponse(reponse)
          });
          ExamenReponses.create({
            title: 'peut etre',
          }).then(reponse => {
            question.addReponse(reponse);
          });
          ExamenReponses.create({
            title: 'je ne sais pas (bonne reponse)',
          }).then(reponse => {
            question.addReponse(reponse);
            question.setValide(reponse);
          });
        });

        ExamenQuestion.create({
          title: 'De quel generique sagit il ?',
        }).then(question => {
          examen.addQuestion(question);
          ExamenMultimedia.create({
            type: 'AUDIO',
            link: 'https://autogoback237.herokuapp.com/public/examen/music/song3.mp3',
          }).then(audio => {
            question.setAudio(audio);
          });
          ExamenMultimedia.create({
            type: 'IMAGE',
            link: 'https://autogoback237.herokuapp.com/public/examen/image/img3.png',
          }).then(image => {
            question.setHead(image);
          });
          ExamenReponses.create({
            title: 'connan l avanturier (bonne reponse)',
          }).then(reponse => {
            question.addReponse(reponse);
            question.setValide(reponse);
          });
          ExamenReponses.create({
            title: 'olivier atom',
          }).then(reponse => {
            question.addReponse(reponse);
          });
          ExamenReponses.create({
            title: 'Zorro',
          }).then(reponse => {
            question.addReponse(reponse);
          });
          ExamenReponses.create({
            title: 'Ken le survivant',
          }).then(reponse => {
            question.addReponse(reponse);
            
          });
        });
      });

      WebsiteStats.create({
        visites: 0,
      }).then(stats => console.log('stats', stats));

      BotMessage.create({
        label: `Êtes-vous satisfait de notre réponse ?`,
        propositionLabel: `mon ressenti`,
      })
        .then(botStatisfaction => {
          BotMessage.create({
            label: `Laissez-nous votre adresse e-mail ou votre numéro WhatsApp plus recevoir des informations de la part d’AUTO-GO.`,
            propositionLabel: `Oui, merci !`,
            codeAction: 6,
          }).then(botMess => {
            botStatisfaction.addBotMessage(botMess);
          });
          BotMessage.create({
            label: `Laissez-nous votre adresse e-mail ou votre numéro WhatsApp au cas où vous changeriez d'avis.`,
            propositionLabel: `Non, merci !`,
            codeAction: 7,
          }).then(botMess => {
            botStatisfaction.addBotMessage(botMess);
          });
        })
        .then(b => console.log(b));

      BotMessage.create({
        label: `Bienvenue sur AUTO-GO. Comment pouvons-nous vous aider 😊 ? `,
        propositionLabel: `Je suis nouveau`,
      }).then(botMessage => {
        BotMessage.create({
          label: `Quel type d’information recherchez-vous ? `,
          propositionLabel: `J’ai des questions pour créer mon compte AUTO-GO.`,
        })
          .then(botMessage1 => {
            //premiere reponse
            BotMessage.create({
              label: `Notre équipe AUTO-GO est ravie de vous présenter les tarifs et durées de formations`,
              propositionLabel: `Des informations sur les tarifs et durées de formations du code`,
              codeAction: 1,
            }).then(botMessage2 => {
              botMessage1.addBotMessage(botMessage2).then(() => {
                botMessage.addBotMessage(botMessage1).then(() => {
                  // console.log('botMessage', botMessage);
                });
              });
            });
            BotMessage.create({
              label: `Notre équipe AUTO-GO est ravie de vous présenter les documents et éléments nécessaires.`,
              propositionLabel: `Des informations sur les documents et éléments nécessaires pour créer votre compte AUTO-GO`,
              codeAction: 2,
            }).then(botMessage2 => {
              botMessage1.addBotMessage(botMessage2).then(() => {
                botMessage.addBotMessage(botMessage1);
                // .then(()=>{
                //   console.log('botMessage', botMessage)
                // })
              });
            });
          })
          .then(botMessage => {
            // console.log('botMessage', botMessage);
          });

        // deuxieme reponse
        BotMessage.create({
          label: `Notre équipe AUTO-GO est ravie de vous répondre. Pouvez-vous remplir ce formulaire ?`,
          propositionLabel: `Je souhaite contacter un conseiller AUTO-GO.`,
          codeAction: 3,
        }).then(botMessage1 => {
          botMessage.addBotMessage(botMessage1);
          // .then()
        });

        //troisieme reponse
        BotMessage.create({
          label: `Notre équipe AUTO-GO est ravie de vous apporter des réponses à vos questions. Vu que vous êtes client, nous vous invitons à vous connecter à votre compte depuis votre ordinateur, tablette ou téléphone multimédia. Nous aurons ainsi accès à toutes vos informations ce qui nous permettra vous apporter des réponses sur mesure.`,
          propositionLabel: `Je suis client, j’ai des questions sur mon compte ou ma formation.`,
          codeAction: 4,
        }).then(botMessage1 => {
          botMessage.addBotMessage(botMessage1);
          // .then()
        });

        //quatrieme reponse
        BotMessage.create({
          label: `Notre équipe AUTO-GO se tient à votre disposition. Pouvez-vous nous aiguiller sur votre sollicitation ?`,
          propositionLabel: `Autre.`,
          codeAction: 5,
        }).then(botMessage1 => {
          botMessage.addBotMessage(botMessage1);
          // .then()
        });
      });

      GrandProfUserConnectedMessage1()
      GrandProfUserConnectedMessage2()
      GrandProfUserConnectedMessage3()
      Theme.create({
        nom: 'La route et le reseau routier de votre environement',
      }).then(theme => {
        //creation de tous les chapitres associes
        Chapitre.create({
          titre: 'La route',
        }).then(chapitre => {
          //creation de toutes les parties associees
          Partie.create({
            titre: 'Observation',
          }).then(partie => {
            chapitre.addParties(partie).then(chap => {
              Partie.create({
                titre: 'Exercice',
                genre: 'quizz',
              }).then(partie1 => {
                chapitre.addParties(partie1).then(chap1 => {
                  Partie.create({
                    titre: 'Remarque réelle',
                  }).then(partie2 => {
                    chapitre.addParties(partie2).then(chap2 => {
                      Partie.create({
                        titre: 'Informations utiles',
                      }).then(partie3 => {
                        chapitre.addParties(partie3).then(chap3 => {
                          Partie.create({
                            titre: 'La route',
                          }).then(partie4 => {
                            chapitre.addParties(partie4).then(chap4 => {
                              theme.addChapitres(chap4);
                              console.log(theme.toJSON());
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });

        Chapitre.create({
          titre: 'Le reseau routier de votre pays',
        }).then(chapitre => {
          //creation de toutes les parties associees
          Partie.create({
            titre: 'Observation',
          }).then(partie => {
            chapitre.addParties(partie).then(chap1 => {
              Partie.create({
                titre: 'Exercice',
                genre: 'quizz',
              }).then(partie1 => {
                chapitre.addParties(partie1).then(chap2 => {
                  Partie.create({
                    titre: 'Informations utiles',
                  }).then(partie2 => {
                    chapitre.addParties(partie2).then(chap3 => {
                      theme.addChapitres(chap3);
                      console.log(chap3.toJSON());
                    });
                  });
                });
              });
            });
          });
        });

        Chapitre.create({
          titre: 'Test de connaissances',
        }).then(chap => {
          Partie.create({
            titre: 'Informations utiles',
          }).then(partie => {
            chap.addParties(partie).then(chap3 => {
              theme.addChapitres(chap3);
              console.log(chap3.toJSON());
            });
          });
        });
      });

      User.create({
        password: 'efoo123',
        nom: 'teacher',
        prenom: 'bright',
        birthDate: '2001-06-20',
        phone: '+237655388662',
        email: 'teacher@gmail.com',
        status: 1,
      }).then(user => {
        Theme.findOne({ where: { id: 1 } }).then(theme => {
          theme.addUser(user).then(newUser => {
            console.log(newUser);
          });
        });
      });
      User.create({
        password: 'efoo123',
        nom: 'student',
        prenom: 'bright',
        birthDate: '2001-08-10',
        phone: '+237655388662',
        email: 'student@gmail.com',
        status: 0,
      }).then(user => {
        Theme.findOne({ where: { id: 1 } }).then(theme => {
          user.addTheme(theme).then(newUser => console.log(newUser));
        });
      });

      console.log('La base de donnée a bien été initialisée !');
    })
    .catch(err => console.log('connexion bd echouee \n', err));
};
