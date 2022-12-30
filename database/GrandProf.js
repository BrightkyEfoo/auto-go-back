import { BotMessage } from './Sequelize.js';

export const GrandProfUserConnectedMessage1 = () => {
  BotMessage.create({
    label: `Bonjour [prenoms]. Bienvenue dans votre Labo AUTO-GO pour tests d’examen. Voulez-vous un accompagnement pour votre préparation d’examen du code 😊 ? `,
    propositionLabel: `code`,
  }).then(botMessage => {
    BotMessage.create({
      label: `Merci pour votre sollicitation. Grand Prof se tient à votre disposition 😊. Comment faire pour suivre méthodiquement votre formation ?`,
      propositionLabel: `Oui, SVP !`,
    })
      .then(botMessage1 => {
        //premiere reponse
        BotMessage.create({
          label: `a Soyez tres attentif, ceci est notre support video destiné a vous guider`,
          propositionLabel: `Appuyez-vous sur notre support vidéo pour vous guider.`,
          codeAction: 8,
        }).then(botMessage2 => {
          botMessage1.addBotMessage(botMessage2).then(() => {
            botMessage.addBotMessage(botMessage1);
          });
        });
        BotMessage.create({
          label: `D'accord voici notre programme de cours...`,
          propositionLabel: `Utilisez notre programme de cours pour vous aider.`,
          codeAction: 9,
        }).then(botMessage2 => {
          botMessage1.addBotMessage(botMessage2).then(() => {
            botMessage.addBotMessage(botMessage1);
          });
        });
        BotMessage.create({
          label: `Cliquez ici pour voir le guide...`,
          propositionLabel: `Lire le guide dans mon Labo AUTO-GO pour comprendre l’approche de formation`,
          codeAction: 10,
        }).then(botMessage2 => {
          botMessage1.addBotMessage(botMessage2).then(() => {
            botMessage.addBotMessage(botMessage1);
          });
        });
      })
      .then(botMessage => {
        // console.log('botMessage', botMessage);
      });

    // deuxieme reponse
    BotMessage.create({
      label: `C’est noté [prenoms] ! Bon courage pour votre formation et n’hésitez pas de nous solliciter en cas de besoin. 😉`,
      propositionLabel: `Non, merci ! Je m’en sors bien.`,
      codeAction: 11,
    }).then(botMessage1 => {
      botMessage.addBotMessage(botMessage1);
      // .then()
    });
  });
};

export const GrandProfUserConnectedMessage2 = ()=>{
      // repertoire TESTS D’EXAMEN DU CODE

  BotMessage.create({
    label: `Bonjour [prenoms]. Bienvenue dans votre Labo AUTO-GO pour tests d’examen. Voulez-vous un accompagnement pour votre préparation d’examen du code 😊 ?`,
    propositionLabel: `examen`,
  }).then(botMessage => {
    BotMessage.create({
      label: `Merci pour votre sollicitation. Grand Prof se tient à votre disposition 😊. Comment faire pour suivre méthodiquement votre formation ? `,
      propositionLabel: `Oui, SVP !`,
    })
      .then(botMessage1 => {
        //premiere reponse
        BotMessage.create({
          label: `Voici notre support video destiné a vous guider`,
          propositionLabel: `Appuyez-vous sur notre support vidéo pour vous guider.`,
          codeAction: 12,
        }).then(botMessage2 => {
          botMessage1.addBotMessage(botMessage2).then(() => {
            botMessage.addBotMessage(botMessage1).then(() => {
              // console.log('botMessage', botMessage);
            });
          });
        });
        BotMessage.create({
          label: `Cliquez ici pour pouvoir lire le guide dans Tests d’examen pour comprendre l’approche des tests d’examen`,
          propositionLabel: `Lire le guide dans Tests d’examen pour comprendre l’approche des tests d’examen`,
          codeAction: 13,
        }).then(botMessage2 => {
          botMessage1.addBotMessage(botMessage2).then(() => {
            botMessage.addBotMessage(botMessage1);
          });
        });
      })
      .then(botMessage => {
        // console.log('botMessage', botMessage);
      });

    // deuxieme reponse
    BotMessage.create({
      label: `C’est noté [prenoms] ! Bon courage pour votre formation et n’hésitez pas de nous solliciter en cas de besoin. 😉`,
      propositionLabel: `Non, merci ! Je m’en sors bien.`,
      codeAction: 14,
    }).then(botMessage1 => {
      botMessage.addBotMessage(botMessage1);
      // .then()
    });
  });
}

export const GrandProfUserConnectedMessage3 = () => {
// repertoire LES CLES POUR REUSSIR SON PERMIS

BotMessage.create({
    label: `Bonjour [prenoms]. Bienvenue dans votre labo AUTO-GO pour le guide. Voulez-vous un accompagnement pour votre guide pour la préparation au permis de conduire ? `,
    propositionLabel: `cles`,
  }).then(botMessage => {
    BotMessage.create({
      label: `Merci pour votre sollicitation. Grand Prof se tient à votre disposition. Comment faire pour suivre méthodiquement votre guide ?`,
      propositionLabel: `Oui, SVP !`,
    })
      .then(botMessage1 => {
        //premiere reponse
        BotMessage.create({
          label: `Cliquez ici pour acceder a votre labo AUTO-GO`,
          propositionLabel: `Appuyez-vous sur Mon Labo AUTO-GO pour l’explication du contenu de cours et de l’approche à suivre pour optimiser sa formation.`,
          codeAction: 15,
        }).then(botMessage2 => {
          botMessage1.addBotMessage(botMessage2).then(() => {
            botMessage.addBotMessage(botMessage1).then(() => {
              // console.log('botMessage', botMessage);
            });
          });
        });
        BotMessage.create({
          label: `Cliquez ici pour acceder a nos test d'examen`,
          propositionLabel: `Lire le guide dans TESTS D’EXAMEN pour comprendre l’approche des tests d’examen.`,
          codeAction: 16,
        }).then(botMessage2 => {
          botMessage1.addBotMessage(botMessage2).then(() => {
            botMessage.addBotMessage(botMessage1);
          });
        });
        BotMessage.create({
          label: `Cliquez ici pour acceder a nos FAQs`,
          propositionLabel: `Appuyez-vous sur WINGO pour accéder au contenu FAQ.`,
          codeAction: 17,
        }).then(botMessage2 => {
          botMessage1.addBotMessage(botMessage2).then(() => {
            botMessage.addBotMessage(botMessage1);
          });
        });
      })
      .then(botMessage => {
        // console.log('botMessage', botMessage);
      });

    // deuxieme reponse
    BotMessage.create({
      label: `C’est noté [Prénoms du visiteur connecté à son compte] ! Bon courage pour votre lecture et n’hésitez pas de nous solliciter en cas de besoin.`,
      propositionLabel: `Non, merci ! Je m’en sors bien.`,
      codeAction: 18,
    }).then(botMessage1 => {
      botMessage.addBotMessage(botMessage1);
    });
  });

}