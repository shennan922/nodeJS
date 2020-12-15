const db = require('../models/Index')
const config = require('../config')
const Jwt = require('jsonwebtoken')
const logger = require('../logger/log4')
const MD5 = require('crypto-js/md5')
const NodeRSA = require('node-rsa');

function tokenSign ({ id, email }) {
  try {
    return Jwt.sign({ id, email }, config.token.secretOrPrivateKey, config.token.options)
  } catch (error) {
    throw (error)
  }
}

function comparePassword (user,password) {
  return user.password.toString() === MD5(password).toString()
}

const User = db.User

module.exports = {
  async register (req, res) {
    try {
      const user = await User.create(req.body)
      res.status(201).send({
        code: 200,
        user: {
          email: user.email,
          password: user.password
        },
        token: tokenSign(user)
      })
      logger.logger.info('User register: '+user.email)
    } catch (error) {
      let err = []
      if (error.errors) {
        error.errors.forEach(validateError => {
          err.push(validateError.message)
        })
      }
      res.status(400).send({
        code: 400,
        error: err.join('<br/>')
      })
      logger.logger.fatal('User register fail: '+error)
    }
  },
  async getUserById (req, res) {
    try {

      var publicKey = new NodeRSA(config.keys.publicKey);
      var encrypted = publicKey.encrypt(config.wechat.appID+'&'+Date.now(), 'base64');
      console.log(encrypted);
      timeStamp =Date.now()
      timeStamp1 =Date.now()
      var tt = timeStamp1-timeStamp
      var privateKey = new NodeRSA(config.keys.privateKey);
      decrypted = privateKey.decrypt(encrypted, 'utf8');
      console.log(timeStamp);
      const user = await User.findByPk(req.params.id)
     
      if (user) {
        logger.logger.info('User search: '+req.params.id)
        res.status(200).send({
          user
        })
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
        logger.logger.error('User search error: user not found')
      }
    } catch (error) {      
      res.status(500).send({
        code: 500,
        error: '数据查询失败'
      })
      logger.logger.fatal('User search fail: '+error.message)
    }
  },
  async update (req, res) {
    try {
      await User.update(
        req.body,
        {
          where: {
            id: req.params.id           
          }
        }
      )
      res.status(200).send({
        message: '数据更新成功'
      })
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据更新失败'
      })
    }
  },
  async delete (req, res) {
    try {
      await User.destroy(
        {
          where: {
            id: req.params.id
          }
        }
      )
      res.status(200).send({
        message: '数据删除成功'
      })
      logger.logger.info('User delete: '+req.params.id)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据删除失败'
      })
      logger.logger.fatal('User delete fail: '+error.message)
    }
  },
  async login (req, res) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      })
      let isValidPassword = comparePassword(user,req.body.password)
      if (isValidPassword) {
        var publicKey = new NodeRSA(config.keys.privateKey);
        var wechatEncrypted = publicKey.encrypt(config.wechat.appID+'&'+Date.now(), 'base64');
        res.send({
          code: 200,
          user: {
            email: user.email,
            id: user.id,
            wechat:wechatEncrypted
          },
          token: tokenSign(user)
        })
        logger.logger.info('User login: '+req.params.id)
      } else {
        res.status(403).send({
          code: 403,
          error: '用户名或密码错误'
        })
        logger.logger.error('User login error: user or password not correct')
      }
    } catch (error) {
      res.status(403).send({
        code: 403,
        error: '用户名或密码错误'
      })
      logger.logger.fatal('User login fail: '+error.message)
    }
  }
}
