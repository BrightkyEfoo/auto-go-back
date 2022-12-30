export const ChapitreModel = (sequelize, DataTypes) => {
  return sequelize.define(
    'Chapitre',
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
      ratio: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '1/1',
      },
    },
    {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false,
      onDelete: 'CASCADE',
      indexes : [
        {
          fields : ['titre','themeId'],
          unique :true
        }
      ]
    }
  );
};
