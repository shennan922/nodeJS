

module.exports = {
    getUserById (req, res) {
        try {
          const user = {"id":255555,"email":"nan3@nan.com","password":"123456"}
         
          if (user) {
           return {
                code: 200,
                data: user
           }
          } else {
            res.status(400).send({
              code: 400,
              error: '没有找到对应数据'
            })
          }
        } catch (error) {       
          res.status(500).send({
            code: 500,
            error: '数据查询失败'
          })
        }
    }
}