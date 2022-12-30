export const ThemeModel = (sequelize, DataTypes) => {
    return sequelize.define('Theme', {
      id: {
        type: DataTypes.INTEGER(5),
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false
      },
      img : {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue : 'https://freesvg.org/img/1392140719.png'
      },
      ratio: {
        type: DataTypes.STRING(11),
        allowNull: false,
        defaultValue : '1/1'
      }
    }, {
      timestamps: true,
      onDelete: 'CASCADE',
      createdAt: 'created',
      updatedAt: false
    })
}