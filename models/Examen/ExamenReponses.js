export const ExamenReponsesModel = (sequelize, DataTypes) => {
    return sequelize.define(
      'ExamenReponses',
      {
        id: {
          type: DataTypes.INTEGER(10),
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false,
        onDelete: 'CASCADE',
      }
    );
  };
  