const db = require('../models/Index')
const logger = require('../logger/log4')

const SEList = db.SEList
const Team = db.Team
const Hospital = db.Hospital
const Geo = db.Geo
const MLList = db.MLList
const Op = db.Op

SEList.belongsTo(Hospital, {
  foreignKey: 'DepID',
  targetKey: 'NodeID',
  as: 'Department'
});

SEList.belongsTo(Geo, {
  foreignKey: 'CityID',
  targetKey: 'NodeID'
});

SEList.belongsTo(Team, {
  foreignKey: 'TeamID',
  targetKey: 'TeamID'
});

SEList.belongsTo(MLList, {
  foreignKey: 'MLID',
  targetKey: 'MLID'
});

Hospital.belongsTo(Hospital, {
  foreignKey: 'ParentNodeID',
  targetKey: 'NodeID',
  as: 'Hos'
});

module.exports = {
  async getList (req, res) {
    try {
      var data = await SEList.findAll({
        attributes:['SEID','SEName','Department->Hos.NodeDesc','Department->Hos.NodeID','MLList.MLName','Team.TeamName','URL',
                    'Team.TeamID','MLList.MLID'//,['Geo.City','City']
                  ],
        include:[
          {
            model: Geo,
            attributes: [['NodeDesc','City'],['NodeID','CityID']]
          },
          {
            model: Hospital,
            attributes: [['NodeDesc','Dep'],['NodeID','DepID']],
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
            model: MLList,
            attributes: []
          }
        ],
        where:{SEName :{[Op.like]:'%'+req.query.Name+'%'}},
        order: [
          ['CreateDt', 'DESC']
        ],
        raw: true
        
      })

      if (data) {
        data = JSON.parse(JSON.stringify(data).replace(/NodeDesc/g, 'Hospital').replace(/NodeID/g, 'HospitalID').replace(/Department.Dep/g, 'Department').replace(/Geo.City/g, 'City'))
        //data = JSON.parse(JSON.stringify(data).replace(/Department.Dep/g, 'Department'))
        //data = JSON.parse(JSON.stringify(data).replace(/Geo.City/g, 'City'))
        res.status(200).send({
          value:'SEList',
          data:data
        })        
        logger.logger.info('Query SE: '+data.length+' records returned')
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
        logger.logger.error('Query SE: No data found')
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败: ' + error
      })
      logger.logger.fatal('Query SE fail: '+error)
    }
  },
  async create (req, res) {
    try {
      if(await SEList.findOne({where: {SEID:req.body.SEID}})){
        res.status(200).send({
          code: 400,
          message: 'SE ID已经存在'
        })
      }
      else{
        var newSE = {
          SEID: req.body.SEID,
          SEName: req.body.SEName,
          TeamID: req.body.Team,
          MLID: req.body.MLName,
          CityID: req.body.City,
          DepID: req.body.Department,
          CreateDt:req.body.CreateDt
        }
        await SEList.create(newSE)
      }
      
      res.status(200).send({
        code: 200,
        message: 'SE创建成功'
      })
      logger.logger.info("Create SE: "+req.body.SEID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Create SE fail: "+req.body.SEID+'/'+error)
    }
  },
  async update (req, res) {
    try {
      var newSE = {
        SEID: req.body.SEID,
        SEName: req.body.SEName,
        TeamID: req.body.Team,
        MLID: req.body.MLName,
        CityID: req.body.City,
        DepID: req.body.Department,
        ModifyDt:req.body.ModifyDt
      }
      await SEList.update(newSE,{where:{SEID: req.body.SEID}})
      
      res.status(200).send({
        code: 200,
        message: 'SE更新成功'
      })
      logger.logger.info("Update SE: "+newSE.SEID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Update SE fail: "+newSE.SEID+'/'+error)
    }
  },
  async delete (req, res) {
    try {
      await SEList.destroy({where: {SEID: req.query.SEID}})
      res.status(200).send({
        message: '数据删除成功'
      })
      logger.logger.info("Delete SE: "+req.query.SEID)
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据删除失败: ' + error
      })
      logger.logger.fatal("Delete SE fail: "+req.query.SEID+'/'+error)
    }
  }
}
