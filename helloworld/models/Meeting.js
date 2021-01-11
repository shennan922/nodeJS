const Sequelize = require('sequelize')



module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    MeetingID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'MeetingID'
    },
    MeetingDesc: {
      type: DataTypes.STRING(200),      
      field: 'MeetingDesc'
    },    
    Status: {
      type: DataTypes.INTEGER,      
      field: 'Status'
    },
    StartTime: {
      type: DataTypes.DATE,
      field: 'StartTime'
    },
    EndTime: {
      type: DataTypes.DATE,      
      field: 'EndTime'
    },
    IsRecurrent: {
      type: DataTypes.INTEGER,
      field: 'IsRecurrent'
    },
    Room: {
      type: DataTypes.STRING(50),      
      field: 'Room'
    },
    Comments: {
      type: DataTypes.STRING(200),      
      field: 'Comments'
    },
    Password: {
      type: DataTypes.STRING(50),      
      field: 'Password'
    },
    AttendNum: {
      type: DataTypes.INTEGER,      
      field: 'AttendNum'
    },
    AttendInvite: {
      type: DataTypes.STRING(400),      
      field: 'AttendInvite'
    },
    SpecialGuest: {
      type: DataTypes.INTEGER,      
      field: 'SpecialGuest'
    },
    SpecialGuestList: {
      type: DataTypes.STRING(400),      
      field: 'SpecialGuestList'
    },
    AssignedHost: {
      type: DataTypes.STRING(400),      
      field: 'AssignedHost'
    },
    Layout: {
      type: DataTypes.STRING(400),      
      field: 'Layout'
    },
    WaitingRoom: {
      type: DataTypes.INTEGER,      
      field: 'WaitingRoom'
    },
    JoinBeforeHost: {
      type: DataTypes.INTEGER,      
      field: 'JoinBeforeHost'
    },
    JoinMute: {
      type: DataTypes.BOOLEAN,      
      field: 'JoinMute'
    },
    WaterPrint: {
      type: DataTypes.INTEGER,      
      field: 'WaterPrint'
    },
    InsideOrg: {
      type: DataTypes.INTEGER,      
      field: 'InsideOrg'
    },
    AttendFileUpload: {
      type: DataTypes.INTEGER,      
      field: 'AttendFileUpload'
    },
    Simultaneous: {
      type: DataTypes.INTEGER,      
      field: 'Simultaneous'
    },
    LiveStream: {
      type: DataTypes.INTEGER,      
      field: 'LiveStream'
    },
    MeetingLink: {
      type: DataTypes.STRING(400),      
      field: 'MeetingLink'
    },
    MeetingCode: {
      type: DataTypes.STRING(400),      
      field: 'MeetingCode'
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
      modelName: 'Meeting',
      timestamps: false,
      tableName: "Meeting",
      createdAt: true,
      updatedAt:true,
      deletedAt:false
    }
  )
  return Model
}
