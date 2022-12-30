// une partie peut etre un quizz ou un cours

const validGenres = ['quizz', 'lecon'];
export const PartieModel = (sequelize, DataTypes) => {
  return sequelize.define(
    'Partie',
    {
      id: {
        type: DataTypes.INTEGER(5),
        primaryKey: true,
        autoIncrement: true,
      },
      titre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preview: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam facilis natus ipsam corrupti vitae facere cupiditate odio enim, reprehenderit sint quos animi rem. Commodi aperiam',
      },
      genre: {
        type: DataTypes.STRING(6),
        allowNull: false,
        defaultValue: 'lecon', //soit c'est lecon soit c'est quizz,
        validate: {
          isGenreValid(value) {
            if (!validGenres.includes(value)) {
              throw new Error(`Le type d'activite doit etre parmis ceux ci [${validGenres}]`);
            }
          },
        },
      },
      contenu: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue:
          `[{"question":"aaaaaa","reponses":[{"titre":"bon","img":""},{"titre":"mmmm","img":""},{"titre":"mmmm","img":""}],"reponseValide":"1","explication":"eeeeee","img":""},{"question":"erdsjd","reponses":[{"titre":"mmmmm","img":""},{"titre":"bon","img":""},{"titre":"mmmmm","img":""}],"reponseValide":"2","explication":"j jdc dj"},{"question":"sdcevr","reponses":[{"titre":"revrebre","img":""},{"titre":"wcvesvbe","img":""},{"titre":"bon","img":""}],"reponseValide":"3","explication":"wcebver"}]`
        },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    
    {
      timestamps: true,
      createdAt: 'created',
      onDelete: 'CASCADE',
      updatedAt: false,
      indexes : [
        {
          fields : ['titre' , 'genre' , 'ChapitreId'],
          unique : true
        }
      ],
    }
  );
};
