const db = require('../models/Index')
const logger = require('../logger/log4')

const Team = db.Team
const Hospital = db.Hospital
const Geo = db.Geo

const setPath = function( list,level,nodeDesc) {  
  var rJson = [];

  //如果指定level, 则只取指定level以下的层级
  if(level != ''){
    list.filter(list => {return list.Level >= level})
  }

  //将所有的pid的数据加到对应的id数据对象里面去，需要添加一个属性children
  for(var i=0;i<list.length;i++){
    var arr = [];
    for(var j=0;j<list.length;j++){
        if(list[i].NodeID == list[j].ParentNodeID){            
            arr.push(list[j]);         
        }
    }
    if(arr.length > 0){
      list[i].dataValues.children = arr;
    }
  }

  //如果指定节点, 则只取指定节点以下的层级
  if(nodeDesc == ''){
    for(var i=0;i<list.length;i++){
      if(list[i].ParentNodeID == ''){
          rJson.push(list[i])
      }
    }
  }
  else{
    for(var i=0;i<list.length;i++){
      if(list[i].NodeDesc == nodeDesc && list[i].Level == level){
          rJson.push(list[i])
      }
    }
  }

  return rJson  
};

module.exports = {
  async getHospital (req, res) {    
    try {  
      const city = await Geo.findOne({        
        where: {
          NodeDesc: req.query.City,
          //NodeDesc: req.params.City,
          Level: 3
        }
      })
      var cityID = req.query.City==''?'':city.dataValues.NodeID
      var data
      if(cityID==''){
        data = await Hospital.findAll()
      }
      else{
        data = await Hospital.findAll({where: {CityID:{ [Op.or]:[cityID,'']}}})
      }
      if (data) {
        res.status(200).send({
          value: 'Hospital',
          data: data
        })
        logger.logger.info('Query Hospital: '+data.length+' records returned')
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
        logger.logger.error('Query Hospital: No data found')
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败: '+error
      })
      logger.logger.fatal('Query Hospital fail: '+error)
    }
  },
  async getTeam (req, res) {
    try {
      const data = await Team.findAll()
      if (data) {
        res.status(200).send({
          value: 'Team',
          data: data
        })
        logger.logger.info('Query Team: '+data.length+' records returned')
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
        logger.logger.error('Query Team: No data found')
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败: ' + error
      })
      logger.logger.fatal('Query Team fail: '+error)
    }
  },
  async getGeoTree (req, res) {
    try {
      const geo = await Geo.findAll()
  
      if (geo) {
        const data = setPath( geo,req.query.Level,req.query.NodeDesc);
        res.status(200).send({
          value: 'Geo',
          data: data
        })
        logger.logger.info('Query Geo: '+data.length+' records returned')
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
        logger.logger.error('Query Geo: No data found')
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败:' + error
      })
      logger.logger.fatal('Query Geo fail: '+error)
    }
  }
}
