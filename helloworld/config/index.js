const path = require('path')

module.exports = {
  db: {
    database: process.env.DATABASE || 'NPnode',
    username: 'sa',
    password: '123456',
    options: {
      host: 'localhost',
      dialect: 'sqlite',
      storage: path.resolve(__dirname, '../db/movie.sqlite'),
      define: {
        underscored: true,
        paranoid: true
      }
    }
  },
  token: {
    secretOrPrivateKey: 'NPnode',
    options: {
      expiresIn: '24h'
    }
  },
  statusCode:
  {
    ok: 200,
    notFound: 404,
    internalError: 500
  },
  appInfo:{
    appid:"wx43ce1ba96c04fd5c", //公众号的appid
    secret:"59d51309664e12b4dc7b69f37c60b945", //公众号的secret 重要不要暴露给前端
    wxapi:"https://api.weixin.qq.com/cgi-bin",
    QRurl:'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=',
    expire_seconds:604800
  },
  keys:
  {  

  }
  
}
