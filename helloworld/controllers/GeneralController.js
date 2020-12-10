const db = require('../models/Index')


const Team = db.Team
const Hospital = db.Hospital
const Geo = db.Geo
const Op = require('Sequelize').Op;

const setPath = function( list,level,nodeDesc) {  
  var rJson = [];

  if(level != ''){
    list.filter(list => {return list.Level >= level})
  }
  console.log(level)
  console.log(nodeDesc)
  console.log(JSON.stringify(list))
  //将所有的pid的数据加到对应的id数据对象里面去，需要添加一个属性children
  for(var i=0;i<list.length;i++){
    var arr = [];
    for(var j=0;j<list.length;j++){
        if(list[i].NodeID == list[j].ParentNodeID){            
            arr.push(list[j]);         
        }
    }
    list[i].dataValues.children = arr;

    if(list[i].dataValues.children.length == 0){
      delete list[i].children
    }
  }

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
          Level: 3
        }
      })
      var cityID = req.query.City==''?'':city.dataValues.NodeID
      var data
      if(cityID==''){
        data = await Hospital.findAll({where:{Level:1}})
      }
      else{
        data = await Hospital.findAll({where: {Level:1,CityID:{ [Op.or]:[cityID,'']}}})
      }
      if (data) {
        res.status(200).send({
          value: 'Hospital',
          data: data
        })
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败: '+error
      })
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
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败: ' + error
      })
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
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败:' + error
      })
    }
  }
}
