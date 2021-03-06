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

fs.readdirSync(__dirname)
  .filter(file=>{return file !== 'index.js'})
  .forEach(file=>{
    //const model = sequelize.import(path.join(__dirname, file),sequelize,DataTypes)
    const modelLoad = require('./'+file)
    const model = modelLoad(sequelize,DataTypes)
    db[model.name] = model
    
  })



/*
const user = require('./User')
const student = require('./Student')

const User = user(sequelize,DataTypes)
const Student = student(sequelize,DataTypes)

db.User = User
db.Student = Student
*/
module.exports = db

