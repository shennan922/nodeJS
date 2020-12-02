const path = require('path')
const fs = require('fs')
const config = require('../config')
const user = require('./User')
const { Sequelize, DataTypes, Model } = require('sequelize');
const db = {}
const MD5 = require('crypto-js/md5')

function hashPassword (user, options) {
  if (user.changed('password')) {
    user.password = MD5(user.password).toString()
  }
}
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  config.db.options
)


const User = sequelize.define('user', {
  email: {
    type: DataTypes.STRING,
    unique: {
      msg: '该邮箱地址已被注册，请更换'
    },
    validate: {
      isEmail: {
        msg: '请输入正确的邮箱地址'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    validate: {
      len: {
        min: 5,
        max: 20,
        msg: '密码长度必须大于5小于20'
      }
    }
  }
}, {
  hooks: {
    afterValidate: hashPassword
  },
  sequelize,
  timestamps: false
 
})

db.Sequelize = Sequelize
db.sequelize = sequelize
db.User = User


module.exports = db
