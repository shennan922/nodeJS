const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    SEID: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: 'SEID'
    },
    SeName: {
      type: DataTypes.STRING,
      field: 'SeName'
    },
    TeamID: {
      type: DataTypes.STRING,
      field: 'TeamID'
    },
    CityID: {
      type: DataTypes.STRING,
      field: 'CityID'
    },
    DepID: {
      type: DataTypes.STRING,
      field: 'DepID'
    },
    MLID: {
      type: DataTypes.STRING,
      field: 'MLID'
    },
    URL: {
      type: DataTypes.STRING,
      field: 'URL'
    }
  },
  {
    sequelize,
    modelName: 'SeList',
    timestamps: false,
    tableName: "SE_Master"
  })
  return Model
}
