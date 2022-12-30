export const ExamenQuestionModel = (sequelize, DataTypes) => {
    return sequelize.define(
      'ExamenQuestion',
      {
        id: {
          type: DataTypes.INTEGER(10),
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'question',
        },
        explication : {
          type : DataTypes.STRING(500),
          defaultValue : 'voila il faut toujours bien lire ses cours'
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
  