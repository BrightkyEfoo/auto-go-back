export const ExamenScoreModel = (sequelize, DataTypes) => {
    return sequelize.define('ExamenScore', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      note: {
        type: DataTypes.INTEGER,
      },
      nbQuestions : {
        type : DataTypes.INTEGER
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false,
      onDelete: 'CASCADE',
    })
}