const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    SEID: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: 'SEID'
    },
    SEName: {
      type: DataTypes.STRING,
      field: 'SEName'
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
    ,
    Status: {
      type: DataTypes.INTEGER,
      field: 'Status'
    }
    ,
    OpenID: {
      type: DataTypes.STRING,
      field: 'OpenID'
    }
  },
  {
    sequelize,
    modelName: 'SEList',
    timestamps: false,
    tableName: "SE_Master",
    createdAt: true,
    updatedAt: true
  })
  return Model
}
