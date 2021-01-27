const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    ParamType: {
      type: DataTypes.STRING(200),
      primaryKey: true,
      field: 'ParamType'
    },
    ParamID: {
      type: DataTypes.INTEGER,     
      primaryKey: true, 
      field: 'ParamID'
    },    
    ParamValue: {
      type: DataTypes.STRING(200),
      field: 'ParamValue'
    },
    ParamValue2: {
      type: DataTypes.STRING(200),      
      field: 'ParamValue2'
    },
    ParamValue3: {
      type: DataTypes.STRING(200),
      field: 'ParamValue3'
    },
    CreateDt: {
      type: DataTypes.DATE,      
      field: 'CreateDt'
    },
    ModifyDt: {
      type: DataTypes.DATE,      
      field: 'ModifyDt'
    },    
  },
    {
      sequelize,
      modelName: 'Params',
      timestamps: false,
      tableName: "Params",
      createdAt: true,
      updatedAt:true,
      deletedAt:false
    }
  )
  return Model
}
