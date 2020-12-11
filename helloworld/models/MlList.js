const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    MLID: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: 'MLID'
    },
    MLName: {
      type: DataTypes.STRING,
      field: 'MLName'
    }
    
  },
  {
    sequelize,
    modelName: 'MLList',
    timestamps: false,
    tableName: "ML_Master"
  }
  )
  return Model
}
