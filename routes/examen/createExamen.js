import { Examen, ExamenMultimedia, ExamenQuestion, ExamenReponses } from '../../database/Sequelize.js';

export default app => {
  app.post('/api/examencreate', async (req, res) => {
    const exam = req.body;
    Examen.create({
      title: exam.title,
      type: exam.type,
      description : exam.description,
      tags : exam.tags
    })
      .then(examen => {
        exam.questions.forEach(q => {
          ExamenQuestion.create({
            title: q.title,
            explication: q.explication,
          }).then(async question => {
            // let bool = false
            if (q.audio?.link) {
              ExamenMultimedia.create({
                link: q.audio?.link,
                type: 'AUDIO',
              }).then(audio => {
                question.setAudio(audio);
              });
            }
            if (q.head?.link) {
              ExamenMultimedia.create({
                link: q.head?.link,
                type: q.head?.type,
              }).then(head => {
                question.setHead(head);
              });
            }
            const repValide = q.reponses.filter(r => r.valide);
            if (repValide.length === 0) {
              //il n'y a pas de NULL RESPONSE SYSTEM ni de reponse valide
              //on en cree une

              q.reponses.forEach(r => {
                ExamenReponses.create({
                  title: r.title,
                }).then(response => {
                  question.addReponse(response);
                  if (q.reponses.indexOf(r) === q.reponses.length - 1) {
                    ExamenReponses.create({
                      title: 'NULL RESPONSE SYSTEM',
                    }).then(response => {
                      question.addReponse(response);
                      question.setValide(response);
                    });
                  }
                });
              });
            } else {
              q.reponses.forEach(r => {
                ExamenReponses.create({
                  title: r.title,
                }).then(response => {
                  question.addReponse(response);
                  if (r.valide) {
                    question.setValide(response);
                  }
                });
              });
            }
            examen.addQuestion(question);
          });
        });

        console.log('examen', examen);
        res.json({ examen });
      })
      .catch(err => {
        res.status(404).json({ msg: err.message, err });
      });
  });
};
