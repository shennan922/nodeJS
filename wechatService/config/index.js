const path = require('path')

module.exports = {
  db: {
    database: process.env.DATABASE || 'NPnode',
    username: 'sa',
    password: '123456',
    options: {
      host: 'localhost',
      dialect: 'sqlite',
      storage: path.resolve(__dirname, '../db/wechat.sqlite'),
      define: {
        underscored: true,
        paranoid: true
      }
    }
  },
  token: {
    secretOrPrivateKey: 'NPwechat',
    options: {
      expiresIn: '24h'
    }
  },
  appInfo:{
    appid:"wx43ce1ba96c04fd5c", //公众号的appid
    secret:"59d51309664e12b4dc7b69f37c60b945", //公众号的secret 重要不要暴露给前端
    wxapi:"https://api.weixin.qq.com/cgi-bin"
  },
  errorCode:
  {
    notFound: 404,
    internalError: 500
  },
  keys:
  {
    privateKey:"-----BEGIN ENCRYPTED PRIVATE KEY-----"+
    "MIIBpjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIH4cMawWyYnoCAggA"+
    "MBQGCCqGSIb3DQMHBAjDySfuuMGzhwSCAWCvoBFXasSNvbZpVS8ePMvFiqpuTvgT"+
    "2zwZgRmMKinOxHZivGNVAqoSvXT1On1OX1YehYlEoL1VGcHtwp8xOAOyqZaJJ/Hn"+
    "a26QwENZjyER3USsVeJV3FtaktKeS0u7dRIPfMhjvc6D8J94HCN5ojQL8vKa+C++"+
    "J0kAPLzbWThmUR5sT3RXtSDzHGdCFq27q8kL+X6Jw0ahzyy9FD9RgbGbqGtcaQHb"+
    "X86K9+eTLKGlAXZndaQnO5gD5l+sddpnAt+oUDC6VTEahubQs+b91oiPnqYsIujD"+
    "XfSI+A24EabrONutbZsn7Pmk5AWQkMFi9JdUmrR5Hh9KXR4K2nj6Q8QQ0Vn1F44I"+
    "xY1g+0wXW7r+mU5t8aoiWWIgfkWBLSd6JfH1py3IsJXCiLhCfbhtinnoaKfJgswm"+
    "IOOsXToPxaI26ocE5CwDadafQ53pw/+wJ1lJK66TCnrF8brJWqqIhTJn"+
    "-----END ENCRYPTED PRIVATE KEY-----"
  }
}
