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
  wechat:
  {
      appID:'wx43ce1ba96c04fd5c'      
  },
  keys:
  {  
    publicKey: `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCcgPpTEKH6jYdRCOONmzUohKkd
    dmFuRuFr0x+00p8owNUuwhiaiCAfU82HXPVNJwAVqDKWRbFwhzxG5TUDYwlWP1W+
    8wIVDMsQovjsErRJf37LMn7ruD8t2VieVMg7KUSZXxDmiKVJedD1ymVBr/kPMu4o
    n3deou+3/QAQ6dAMWQIDAQAB
    -----END PUBLIC KEY-----`
  }
}
