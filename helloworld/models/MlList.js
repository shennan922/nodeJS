const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    MLID: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: 'MLID'
    },
    MlName: {
      type: DataTypes.STRING,
      field: 'MlName'
    }
    
  },
  {
    sequelize,
    modelName: 'MlList',
    timestamps: false,
    tableName: "ML_Master"
  }
  )
  return Model
}
