const path = require('path')
const fs = require('fs')
const config = require('../config')
const MD5 = require('crypto-js/md5')
const { Sequelize, DataTypes, Model } = require('sequelize');



const db = {}

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  config.db.options
)

db.Sequelize = Sequelize
db.sequelize = sequelize



const user = require('./User')
const student = require('./Student')

const User = user(sequelize,Sequelize)
const Student = student(sequelize,Sequelize)

db.User = User
db.Student = Student

module.exports = db

