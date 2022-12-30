export const BotMessageModel = (sequelize, DataTypes) => {
    return sequelize.define(
      'BotMessage',
      {
        code: {
          type: DataTypes.INTEGER(10),
          primaryKey: true,
          autoIncrement: true,
        },
        label: {
          type: DataTypes.STRING(500),
          allowNull: false,
          defaultValue: 0,
        },
        propositionLabel : {
          type: DataTypes.STRING(500),
          allowNull: false,
          defaultValue: 0,
        },
        codeAction : {
            type : DataTypes.INTEGER,
            unique : {msg : 'codeAction should be unique'}
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
  