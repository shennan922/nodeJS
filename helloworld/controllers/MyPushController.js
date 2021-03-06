const db = require('../models/Index')
const logger = require('../logger/log4')
var weChat = require('../utils/Wechat')
const config = require('../config')

const MyPush = db.MyPush
const MyContent = db.MyContent
const SEList = db.SEList
const ContentFile = db.MyContentFile
const MyContentCategory = db.MyContentCategory

MyPush.belongsTo(SEList, {
  foreignKey: 'SEID',
  targetKey: 'SEID',
  as: 'SE'
});


async function generateContent11(ContentID,SEID,SearchTerm,ContentCategory,ShortTitle,ContentMessage){
  var files = await ContentFile.findAll({where:{ContentID:ContentID},raw:true})
  let text = []
  
  files.forEach(file => {
    //text.push({"name":file.FileName,"url":file.FileURL})
  });
  let str = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>'
      str += '<title>'+ShortTitle+'</title></head>'
      str += '<body><div style="text-align:left"><h3>'+ShortTitle+'</h3><table border="0">'
      str += '<tr><td style="width: 30%;">SE</td><td style="width: 65%;">'+SEID+'</td></tr>'
      str += '<tr><td>Content Category</td><td>'+ContentCategory+'</td></tr>'
      str += '<tr><td>Search Term</td><td>'+SearchTerm+'</td></tr>'
      if(text.length > 0){
        text.forEach(text => {
          //str += '<tr><td>Attachmnet</td><td><a class="download" href="'+text.url+'">'+text.name+'</a></br></td></tr>'
          str += '<tr><td>Attachmnet</td><td><a class="download" href="http://localhost:3000/myContent/downloadpdf?file=undefined&ContentID=892118">4444.pdf</a></br></td></tr>'
        });        
      }
      //str += '<tr><td>Content</td><td><div style="width:80%; border:1px solid #000"><p>'+ContentMessage+'</p></div></td></tr>'
      str += '<tr><td>Content</td><td><div style="width:80%; border:1px solid #000"><p><img src="http://mmbiz.qpic.cn/mmbiz_jpg/QBmZfnm0uBfAcjSnnpDodSa9CwsgQrJ94juCMyVsfNNlVxVwmFzXL7DUZvDHTSuI1ibUzfUd4dITVItYCN9wWNg/0"></p></div></td></tr>'
      str += '</table>'
      str += '</div></body></html>'
  return str
}

async function generateContent(ContentID,SEID,SearchTerm,ContentCategory,ShortTitle,ContentMessage){
  var start = ContentMessage.indexOf('img')+9
  var end = ContentMessage.indexOf('.jpg')+4
  var img = ContentMessage.substr(start,end-start)
  var msg = ContentMessage
  if(start > 8){
    msg = ContentMessage.replace(img,'http://mmbiz.qpic.cn/mmbiz_jpg/QBmZfnm0uBfAcjSnnpDodSa9CwsgQrJ94juCMyVsfNNlVxVwmFzXL7DUZvDHTSuI1ibUzfUd4dITVItYCN9wWNg/0')
  }

  let str = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>'
      str += '<title>'+ShortTitle+'</title></head>'
      str += '<body><div style="text-align:left">'
      str += msg
      str += '</div></body></html>'
  return str
}

module.exports = {
  async getList (req, res) {
    try {
      var data = await MyPush.findAll({
        order: [
          ['CreateDt', 'DESC']
        ],
        raw: true})

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
      /*
      //if(req.body.IsScheduled == ''){
        req.body.ContentID.split(",").forEach(async ctid => {
          let content = await MyContent.findByPk(ctid)
          let token =await weChat.getAccessToken(Date.now(),config.appInfo.appID)
          
          console.log(content.TextID)
          weChat.pushContentPreview(token,content.TextID,'oJVgv6ZH9l1Jq0BEO3K0QpYZD98I')
          
        });
      //}
      */
      //let token =await weChat.getAccessToken(Date.now(),config.appInfo.appID)
      let token = await weChat.updateAccessToken(config.appInfo.appID,config.appInfo.secret)
      let materials = {
        "articles": []
      }
      let contentID = await req.body.ContentID.split(",")
      let contentCate = await MyContentCategory.findAll({raw:true})
      for(i=0;i<contentID.length;i++){
        let content =  await MyContent.findByPk(contentID[i])
        let category = []
        content.ContentCategory.split(',').forEach(cat=>{
          let cateDesc = contentCate.find((cate)=>{return cate.CategoryID == cat})
          if(cateDesc != undefined){
            category.push(cateDesc.CategoryDesc)
          }
        })
        

        let material = await generateContent(content.ContentID,
          content.SEID,
          content.SearchTerm,
          //content.ContentCategory,
          category.toString(),
          content.ShortTitle,
          content.ContentMessage)
        
        let showCover = 0
        if(i==0){
          showCover = 1
        }

        materials.articles.push({
          "title": content.ShortTitle,
          "thumb_media_id": content.ImgID,
          "author": 'sean',
          "digest": 'zhaiyao',
          "show_cover_pic": showCover,
          "content":  material,
          "content_source_url": config.front+'/data/ContentLink?id='+content.ContentID,
          "need_open_comment":1,
          "only_fans_can_comment":1
        })
      }      
      console.log(materials)
      let textID = await weChat.uploadImageText(token,materials,0)
      
      if(textID.media_id == undefined){
        res.status(200).send({
          code: 400,
          message: '图文消息media_id生成失败: '+textID.errmsg
        })
        logger.logger.error("图文消息media_id生成失败: "+textID.errmsg)  
        return
      } 

      let Push = await weChat.pushContentPreview(token,textID.media_id,config.openID)
      console.log(Push)
      if(Push.errcode != 0){
        res.status(200).send({
          code: 400,
          message: '图文消息推送失败: '+Push.errmsg
        })
        logger.logger.error('图文消息推送失败: '+Push.errmsg)  
        return
      } 
      
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
        CreateDt: db.convertLocalTime(req.body.CreateDt),
        ModifyDt: null,
        TextID: textID
      }
      await MyPush.create(newPush)
      
      res.status(200).send({
        code: 200,
        message: 'My Push创建成功'
      })
      logger.logger.info("Create MyPushList: "+req.body.PushID)
    } catch (error) {
      res.status(200).send({
        code: 400,
        message: '程序异常: ' + error
      })
      logger.logger.fatal("Create MyPushList fail: "+req.body.PushID+'/'+error)
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
        ModifyDt: db.convertLocalTime(req.body.ModifyDt)
      }
      await MyPush.update(newSE,{where:{PushID: req.body.PushID}})
      
      res.status(200).send({
        code: 200,
        message: 'MyPush更新成功'
      })
      logger.logger.info("Update MyPushList: "+req.body.PushID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Update MyPushList fail: "+req.body.PushID+'/'+error)
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
      logger.logger.info("Delete MyPushList: "+req.body.PushID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据删除失败: ' + error
      })
      logger.logger.fatal("Delete MyPushList fail: "+req.body.PushID+'/'+error)
    }
  }
}

