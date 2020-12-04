const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  
  Model.init({
    Name: {
      type: DataTypes.STRING,
      unique: {
        msg: '学生已经存在'
      }
    },
    Age: {
      type: Sequelize.INTEGER,
      validate: {
        len: {
          min: 7,
          max: 12,
          msg: '年龄必须大于7小于12'
        }
      }
    },
    School: {
      type: Sequelize.STRING
    },
    Remark: {
      type: Sequelize.STRING
    }
  },
  {
    sequelize,
    modelName: 'Student',
    timestamps: false,

  }
  )
  return Model
}