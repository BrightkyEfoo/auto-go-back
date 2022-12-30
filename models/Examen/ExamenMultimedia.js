export const ExamenMultimediaModel = (sequelize, DataTypes) => {
    return sequelize.define(
      'ExamenMultimedia',
      {
        id: {
          type: DataTypes.INTEGER(10),
          primaryKey: true,
          autoIncrement: true,
        },
        type: {
          type: DataTypes.STRING(11),
          allowNull: false,
          // defaultValue: 'IMAGE',
        },
        link : {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'https://autogoback237.herokuapp.com/public/examen/image',
        }
      },
      {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false,
        onDelete: 'CASCADE',
      }
    );
  };
  