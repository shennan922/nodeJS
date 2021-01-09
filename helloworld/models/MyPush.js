const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    PushID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'PushID'
    },
    SEID: {
      type: DataTypes.STRING(200),      
      field: 'SEID'
    },    
    Greeting: {
      type: DataTypes.STRING(200),
      field: 'Greeting'
    },
    Categorized: {
      type: DataTypes.INTEGER,      
      field: 'Categorized'
    },
    Priority: {
      type: DataTypes.INTEGER,
      field: 'Priority'
    },
    IsScheduled: {
      type: DataTypes.INTEGER,      
      field: 'IsScheduled'
    },
    ScheduleDate: {
      type: DataTypes.STRING(50),      
      field: 'ScheduleDate'
    },
    ScheduleTime: {
      type: DataTypes.STRING(50),      
      field: 'ScheduleTime'
    },
    RequestType: {
      type: DataTypes.INTEGER,      
      field: 'RequestType'
    },
    ContentID: {
      type: DataTypes.STRING(400),      
      field: 'ContentID'
    },
    MeetingID: {
      type: DataTypes.STRING(400),      
      field: 'MeetingID'
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
      modelName: 'MyPush',
      timestamps: false,
      tableName: "MyPush",
      createdAt: true,
      updatedAt:true,
      deletedAt:false
    }
  )
  return Model
}
