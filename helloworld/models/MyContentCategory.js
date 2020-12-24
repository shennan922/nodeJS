const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    CategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'CategoryID'
    },
    CategoryDesc: {
      type: DataTypes.STRING,
      field: 'CategoryDesc'
    }
  },
    {
      sequelize,
      modelName: 'MyContentCategory',
      timestamps: false,
      tableName: "MyContentCategory"
    }
  )
  return Model
}
