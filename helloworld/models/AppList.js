const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    APPID: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: 'APPID'
    },
    APPSecret: {
      type: DataTypes.STRING,
      field: 'APPSecret'
    },
    APPToken: {
      type: DataTypes.STRING,
      field: 'APPToken'
    }

    
  },
  {
    sequelize,
    modelName: 'APPList',
    timestamps: true,
    tableName: "APP_Master"
  }
  )
  return Model
}
