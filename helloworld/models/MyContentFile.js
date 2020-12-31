const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    ContentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'ContentID'
    },  
    FileID: {
      type: DataTypes.INTEGER,      
      primaryKey: true,
      field: 'FileID'
    },
    FileName: {
      type: DataTypes.STRING(200),
      field: 'FileName'
    },
    FilePath: {
      type: DataTypes.STRING(200),      
      field: 'FilePath'
    },
    FileURL: {
      type: DataTypes.STRING(200),      
      field: 'FileURL'
    },
    CreateDt: {
      type: DataTypes.DATE,      
      field: 'CreateDt'
    },
    ModifyDt: {
      type: DataTypes.DATE,      
      field: 'ModifyDt'
    }
  },
    {
      sequelize,
      modelName: 'MyContentFile',
      timestamps: false,
      tableName: "MyContentFile",
      createdAt: true,
      updatedAt:true,
      deletedAt:false
    }
  )
  return Model
}
