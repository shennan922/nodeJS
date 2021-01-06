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
    appID: "wx43ce1ba96c04fd5c", 
    secret: "59d51309664e12b4dc7b69f37c60b945", 
    wxapi:"https://api.weixin.qq.com/cgi-bin",
    QRurl:'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=',
    snsurl:'https://api.weixin.qq.com/sns/oauth2',
    uploadPermPics:'https://api.weixin.qq.com/cgi-bin/media/upload?',
    uploadPermOther:'https://api.weixin.qq.com/cgi-bin/material/add_material?',
    uploadPermNews:'https://api.weixin.qq.com/cgi-bin/material/add_news?',
    sendMessageurlpre:'https://api.weixin.qq.com/cgi-bin/message/mass/preview?',
    sendMessageurl:'https://api.weixin.qq.com/cgi-bin/message/mass/sendall?',
    expire_seconds:604800
  },
  host:'http://localhost:3000'
  
}
