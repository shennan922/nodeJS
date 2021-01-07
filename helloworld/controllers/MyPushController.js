const db = require('../models/Index')
const logger = require('../logger/log4')

const MyPush = db.MyPush
const MyContent = db.MyContent
const SEList = db.SEList

MyPush.belongsTo(SEList, {
  foreignKey: 'SEID',
  targetKey: 'SEID',
  as: 'SE'
});

module.exports = {
  async getList (req, res) {
    try {
      var data = await MyPush.findAll({raw: true})

      if (data) {
        //data = JSON.parse(JSON.stringify(data).replace(/NodeDesc/g, 'Hospital').replace(/NodeID/g, 'HospitalID').replace(/Department.Dep/g, 'Department').replace(/Geo.City/g, 'City'))
        res.status(200).send({
          value:'MyPushList',
          data:data
        })        
        logger.logger.info('Query MyPushList: '+data.length+' records returned')
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
        logger.logger.error('Query MyPushList: No data found')
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败: ' + error
      })
      logger.logger.fatal('Query MyPushList fail: '+error)
    }
  },
  async create (req, res) {
    try {
      // if(await SEList.findOne({where: {SEID:req.body.SEID}})){
      //   res.status(200).send({
      //     code: 400,
      //     message: 'SE ID已经存在'
      //   })
      // }
      //else{
        var newPush = {
          PushID: req.body.PushID,
          SEID: req.body.SEID,    
          Greeting:req.body.Greeting,
          Categorized: req.body.Categorized,
          Priority:req.body.Priority,
          IsScheduled: req.body.IsScheduled,
          ScheduleDate: req.body.ScheduleDate,
          ScheduleTime: req.body.ScheduleTime,
          RequestType: req.body.RequestType,
          ContentID: req.body.ContentID,
          MeetingID: req.body.MeetingID,
          CreateDt: req.body.CreateDt,
          ModifyDt: null
        }
        await MyPush.create(newPush)
        /*
        if(req.body.IsScheduled == 0){
          req.body.ContentID.split(",").forEach(ctid => {
            let content = MyContent.findByPk(ctid)
            console.log(content)
            console.log(content.textID)
            //weChat.uploadPermMaterial(token,content.textID,'oJVgv6ZH9l1Jq0BEO3K0QpYZD98I')
            //bochao - oJVgv6ZH9l1Jq0BEO3K0QpYZD98I
            //shennan
            //david - oJVgv6e0Ob6vBRU7UdlwdeUG0HYM
          });
        }
        */
     // }
      
      res.status(200).send({
        code: 200,
        message: 'My Push创建成功'
      })
      logger.logger.info("Create MyPushList: "+newSE.SEID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Create MyPushList fail: "+newSE.SEID+'/'+error)
    }
  },
  async update (req, res) {
    try {
      var newPush = {
        PushID: req.body.PushID,
        SEID: req.body.SEID,    
        Greeting:req.body.Greeting,
        Categorized: req.body.Categorized,
        Priority:req.body.Priority,
        IsScheduled: req.body.IsScheduled,
        ScheduleDate: req.body.ScheduleDate,
        ScheduleTime: req.body.ScheduleTime,
        RequestType: req.body.RequestType,
        ContentID: req.body.ContentID,
        MeetingID: req.body.MeetingID,
        CreateDt: null,
        ModifyDt: req.body.ModifyDt
      }
      await MyPush.update(newSE,{where:{PushID: req.body.PushID}})
      
      res.status(200).send({
        code: 200,
        message: 'MyPush更新成功'
      })
      logger.logger.info("Update MyPushList: "+newSE.SEID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Update MyPushList fail: "+newSE.SEID+'/'+error)
    }
  },
  async delete (req, res) {
    try {
      await MyPush.destroy(
        {
          where: {
            PushID: req.query.PushID
          }
        }
      )
      res.status(200).send({
        message: '数据删除成功'
      })
      logger.logger.info("Delete MyPushList: "+newSE.SEID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据删除失败: ' + error
      })
      logger.logger.fatal("Delete MyPushList fail: "+newSE.SEID+'/'+error)
    }
  }
}
