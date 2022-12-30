export const ExamenModel = (sequelize, DataTypes) => {
    return sequelize.define(
      'Examen',
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
        type : {
          type : DataTypes.STRING(7),
          allowNull:false
        },
        tags : {
          type : DataTypes.STRING,
          defaultValue : '[""]'
        },
        description : {
          type : DataTypes.STRING,
          defaultValue : ''
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
  