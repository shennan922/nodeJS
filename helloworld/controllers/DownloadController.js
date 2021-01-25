const db = require('../models/Index')
const logger = require('../logger/log4')
var fs=require('fs');
var ueditor = require('ueditor');
const Content = db.MyContent
const ContentFile = db.MyContentFile
const SEList = db.SEList
const config = require('../config')

// Content.belongsTo(SEList, {
//   foreignKey: 'SEID',
//   targetKey: 'SEID',
//   as: 'SE'
// });

module.exports = {
  async getList (req, res) {
    try {
      var data = await Content.findAll({
        attributes:['ContentID','SEID','SearchTerm','ContentCategory','ShortTitle','ContentMessage','CreateDt','ModifyDt','PhotoName','PhotoPath'],
        include:[
          {
            model: SEList,
            attributes: ['SEName'],
            as: 'SE'
          }
        ],
        raw: true
      })
      
      if (data) {
        data = JSON.parse(JSON.stringify(data).replace(/SE.SEName/g, 'SEName'))
        res.status(200).send({
          value: 'MyContentList',
          data: data
        })
        logger.logger.info('Query MyContent: '+data.length+' records returned')
      } else {
        res.status(200).send({
          code: 200,
          error: '没有找到对应数据'
        })
        logger.logger.error('Query MyContent: No data found')
      }
    } catch (error) {
      res.status(400).send({
        code: 400,
        error: '数据查询失败'
      })
      logger.logger.fatal('Query MyContent fail: '+error)
    }
  },
  async uploadPdf(req,res){
    let form = new formidable.IncomingForm()
    form.encoding = 'utf-8' // 编码
    form.keepExtensions = true // 保留扩展名
    form.parse(req, async (err, fields, files) => {
      if(err) return next(err)
      
      var pathNew = './/contents//'+fields.ContentID
      var pathFUll = pathNew + '//'+files.file.name
      fs.mkdir(pathNew,{recursive:true},(err)=>{
        if(err){
            throw err;
        }else{
            console.log('ok!');
        }
      });
      fs.rename(files.file.path,pathFUll,(err)=>{if(err) return next(err)})

      var newContentFile = {
        ContentID: fields.ContentID,
        FileID: fields.FileID,
        FileName: files.file.name,
        FilePath: pathNew,
        FileURL: config.host+'/myContent/downloadpdf?file='+pathFUll,
        CreateDt: fields.UploadTime
      }
      await ContentFile.create(newContentFile).catch((e)=>{console.log(e)})
    })
    
    


    

    res.status(200).send({
      code: 200,
      message: 'Content创建成功',
      data: 'success upload'
    })
  },
  async downloadImg(req, res) {    
    try{
      res.set({
        "Content-Type":"application/jpeg",//告诉浏览器这是一个二进制文件
        "Content-Disposition":"attachment; filename=xxx.jpg"//告诉浏览器这是一个需要下载的文件      
      });
      // fs.createReadStream('helloworld/public/images/'+req.params.ContentID).pipe(res); 

      let imgPath = 'public/images/'+req.params.ContentID
      if(fs.existsSync(imgPath)){
        fs.createReadStream(imgPath).pipe(res); 
      }
      else{
        res.status(400).send({
          code: 400,
          data:null,
          message:'图片不存在'
        })
      }
      /*
      Content.findByPk(req.params.ContentID).then((img)=>{
        fs.createReadStream('.//contents//'+req.params.ContentID+'//'+img.PhotoName).pipe(res);   
      }).catch((err)=>{
        res.status(400).send({
          code: 400,
          data:null,
          message:'fail: '+err
        })
      })
      */
    }
    catch(err){
      logger.logger.fatal("download UE img fail: " + req.params.ContentID + '/' + err)
    }


  },
  async downloadPdf(req, res) {
    res.set({
      "Content-Type":"application/octet-stream;charset=base64",//告诉浏览器这是一个二进制文件
      "Content-Disposition":"attachment; filename=xxx.pdf"//告诉浏览器这是一个需要下载的文件      
    });
    fs.createReadStream(req.query.file).pipe(res);
  }, 
}

