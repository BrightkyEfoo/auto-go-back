export const SectionModel = (sequelize, DataTypes) => {
    return sequelize.define('Section', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true
      },
      titre: {
        type: DataTypes.STRING,
      },
      genre: {
        type: DataTypes.STRING,
      },
      certification: {
        type: DataTypes.STRING,
      },
      Duree: {
        type: DataTypes.STRING,
      } 
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
}