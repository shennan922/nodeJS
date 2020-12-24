const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    ContentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'ContentID'
    },
    SEID: {
      type: DataTypes.STRING(4000),      
      field: 'SEID'
    },    
    SearchTerm: {
      type: DataTypes.STRING,
      field: 'SearchTerm'
    },
    ContentCategory: {
      type: DataTypes.STRING,      
      field: 'ContentCategory'
    },
    ShortTitle: {
      type: DataTypes.STRING,
      field: 'ShortTitle'
    },
    ContentMessage: {
      type: DataTypes.STRING(4000),      
      field: 'ContentMessage'
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
      modelName: 'MyContent',
      timestamps: false,
      tableName: "MyContent",
      createdAt: true,
      updatedAt:true,
      deletedAt:false
    }
  )
  return Model
}
