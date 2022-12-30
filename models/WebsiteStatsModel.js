export const WebsiteStatsModel = (sequelize, DataTypes) => {
  return sequelize.define(
    'WebsiteStats',
    {
      id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      visites: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      previousValue : {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      allVisites:{
        type : DataTypes.STRING,
        defaultValue : '[]'
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
