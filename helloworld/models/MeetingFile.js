const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    MeetingID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'MeetingID'
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
      modelName: 'MeetingFile',
      timestamps: false,
      tableName: "MeetingFile",
      createdAt: true,
      updatedAt:true,
      deletedAt:false
    }
  )
  return Model
}
