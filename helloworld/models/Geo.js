const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    Level: {
      type: DataTypes.INTEGER,
      field: 'Level'
    },
    NodeID: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: 'NodeID'
    },
    NodeDesc: {
      type: DataTypes.STRING,
      field: 'NodeDesc'
    },
    ParentNodeID: {
      type: DataTypes.STRING,
      field: 'ParentNodeID'
    }
  },
  {
    sequelize,
    modelName: 'Geo',
    timestamps: false,
    tableName: "Geography"
  }
  )
  return Model
}
