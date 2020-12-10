const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    TeamID: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: 'TeamID'
    },
    TeamName: {
      type: DataTypes.STRING,
      field: 'TeamName'
    },
    TeamDesc: {
      type: DataTypes.STRING,
      field: 'TeamDesc'
    }
  },
  {
    sequelize,
    modelName: 'Team',
    timestamps: false,
    tableName: "Team"
  }
  )
  return Model
}
