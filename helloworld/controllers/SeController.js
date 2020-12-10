const db = require('../models/Index')
const logger = require('../logger/log4')

const Op = require('Sequelize').Op;
const SeList = db.SeList
const Team = db.Team
const Hospital = db.Hospital
const Geo = db.Geo
const MlList = db.MlList

SeList.belongsTo(Hospital, {
  foreignKey: 'DepID',
  targetKey: 'NodeID',
  as: 'Department'
});

SeList.belongsTo(Geo, {
  foreignKey: 'CityID',
  targetKey: 'NodeID'
});

SeList.belongsTo(Team, {
  foreignKey: 'TeamID',
  targetKey: 'TeamID'
});

SeList.belongsTo(MlList, {
  foreignKey: 'MLID',
  targetKey: 'MLID'
});

Hospital.belongsTo(Hospital, {
  foreignKey: 'ParentNodeID',
  targetKey: 'NodeID',
  as: 'Hos'
});

module.exports = {
  async getSeList (req, res) {
    try {
      var data = await SeList.findAll({
        attributes:['SEID','SeName','Geo.NodeDesc','Department->Hos.NodeDesc1','MlList.MlName','Team.TeamName','URL'],
        include:[
          {
            model: Geo,
            attributes: [['NodeDesc','City']]
          },
          {
            model: Hospital,
            attributes: [['NodeDesc','Dep']],
            as: 'Department',
            include:[
              {
                model: Hospital,
                attributes:[],
                as: 'Hos'
              }
            ]
          },
          {
            model: Team,
            attributes: []
          },
          {
            model: MlList,
            attributes: []
          }
        ],
        where:{SeName :{[Op.like]:'%'+req.query.Name+'%'}},
        raw: true
        
      })

      if (data) {
        data = JSON.parse(JSON.stringify(data).replace(/NodeDesc/g, 'Hospital'))
        data = JSON.parse(JSON.stringify(data).replace(/Department.Dep/g, 'Department'))
        data = JSON.parse(JSON.stringify(data).replace(/Geo.City/g, 'City'))
        res.status(200).send({
          value:'SeList',
          data:data
        })        
        logger.logger.info('Query SE: '+data.length+' records returned')
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
        logger.logger.error('No data found')
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败: ' + error
      })
      logger.logger('Query SE exception: '+error)
    }
  },
  async createSE (req, res) {
    try {
      console.log(SeList.findOne({where: {SEID:req.body.SEID}}).length)
      if(SeList.findOne({where: {SEID:req.body.SEID}}).length > 0){
        res.status(400).send({
          code: 400,
          message: 'SE ID已经存在'
        })
      }
      else{
        var newSE = {
          SEID: req.body.SEID,
          SeName: req.body.SeName,
          TeamID: req.body.Team,
          MLID: req.body.MLName,
          CityID: req.body.City,
          DepID: req.body.Department
        }
        await SeList.create(newSE)
      }
      
      res.status(200).send({
        code: 200,
        message: 'SE创建成功'
      })
      logger.logger.info("Create SE: "+newSE.SEID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Exception: "+newSE.SEID)
    }
  },
  async updateSE (req, res) {
    try {
      var newSE = {
        SEID: req.body.SEID,
        SeName: req.body.SeName,
        TeamID: req.body.Team,
        MLID: req.body.MLName,
        CityID: req.body.City,
        DepID: req.body.Department
      }
      await SeList.update(newSE,{where:{SEID: req.body.SEID}})
      
      res.status(200).send({
        code: 200,
        message: 'SE更新成功'
      })
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
    }
  },
  async deleteSE (req, res) {
    try {
      await SeList.destroy(
        {
          where: {
            SEID: req.query.SEID
          }
        }
      )
      res.status(200).send({
        message: '数据删除成功'
      })
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据删除失败: ' + error
      })
    }
  }
}
