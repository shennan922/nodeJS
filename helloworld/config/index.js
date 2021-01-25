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
      },
      //timezone: '+08:00'
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
  meettingInfo:
  {
    X_TC_Key: 'DDN9mu0QWkfKIaoHTFBs8yLpQbl8yl4n',
    AppId: '210010383',
    secret:'vUIxLu1MBycGhvAe5CyqVlQdPvHaj2VKquqaW6gEHJwP0nyz',
    SDKId:'16100009891',
    url:'https://api.meeting.qq.com/v1/meetings'
  },
  appInfo:{
    appID: "wx43ce1ba96c04fd5c", 
    //wx43ce1ba96c04fd5c
    //wx2e27bd4f540c03ae - bochao
    secret: "59d51309664e12b4dc7b69f37c60b945", 
    //59d51309664e12b4dc7b69f37c60b945
    //1bf9485856d52050e990bdd967390a98 - bochao
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
  host:'http://localhost:3000',
  front: 'http://localhost:8080',
  openID:'oJVgv6ZH9l1Jq0BEO3K0QpYZD98I'
  //bochao2 - oxVS35xGeWkwUdhXch6m3-DJeG58
  //bochao - oJVgv6ZH9l1Jq0BEO3K0QpYZD98I
  //shennan - oJVgv6a8CT5JWPbaS-21t2cp_NNk
  //david - oJVgv6e0Ob6vBRU7UdlwdeUG0HYM
  //xintong - oJVgv6VS8300wzNDG0oCM8M6JNCo
  
}
