const db = require('../models/Index')
const logger = require('../logger/log4')
const config = require('../config')
var meeting_api = require('../utils/Meetting')(config.meettingInfo.X_TC_Key, config.meettingInfo.secret, config.meettingInfo.AppId,config.meettingInfo.SDKId);

const Meeting = db.Meeting


module.exports = {
  async getList (req, res) {
    try {
      var data = await Meeting.findAll({
        order: [
          ['CreateDt', 'DESC']
        ],
        raw: true})

      if (data) {
        //data = JSON.parse(JSON.stringify(data).replace(/NodeDesc/g, 'Hospital').replace(/NodeID/g, 'HospitalID').replace(/Department.Dep/g, 'Department').replace(/Geo.City/g, 'City'))
        res.status(200).send({
          value:'MyMeetingList',
          data:data
        })        
        logger.logger.info('Query Meeting: '+data.length+' records returned')
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
        logger.logger.error('Query Meeting: No data found')
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败: ' + error
      })
      logger.logger.fatal('Query Meeting fail: '+error)
    }
  },
  async create (req, res) {
    var hosts = []
    req.body.AssignedHost.split(',').forEach(host => {
      hosts.push({userid:host})
    });
    var invitees = []
    req.body.AttendInvite.split(',').forEach(invitee => {
      invitees.push({userid:invitee})
    });

    var create_params = {
      userid: req.body.UserID,                                    //调用方用于标示用户的唯一 ID（例如企业用户可以为企业账户英文名、个人用户可以为手机号等）
      instanceid: 1,                                              //用户的终端设备类型。[1:PC, 2:Mac, 3:Android, 4:iOS, 5:Web, 6:iPad, 7:Android Pad, 8:小程序] 
      subject: req.body.MeetingDesc,                              //会议主题
      type: 0,                                                    //会议类型 0-预约， 1-快速
      hosts: hosts,                                               //会议主持人的用户 ID，如果没有指定，主持人将被设定为上文的 userid，即 API 调用者。
      // invitees: [{ userid: 'test1', is_anonymous: true, neck_name: 'anonimity' }, { userid: 'guest1' }, { userid: 'guest2' }], 
      invitees: invitees,                                         //邀请的参会者，可为空
      start_time: Math.floor(Date.parse(req.body.StartTime) / 1000) + '',     //预约会议的开始时间(以秒为单位的标准时间戳)
      end_time: Math.floor(Date.parse(req.body.EndTime) / 1000) + '',  //预约会议的结束时间(以秒为单位的标准时间戳)      
      password: req.body.Password,                                //会议密码，可不填
      settings: {                                                 //会议媒体参数配置
          mute_enable_join: req.body.JoinMute,                    //入会时静音
          allow_unmute_self: false,                               //允许参会者取消静音
          mute_all: false,                                        //全体静音 
          host_video: true,                                       //主持人视频
          participant_video: false,                               //参会者视频
          enable_record: false,                                   //开启录播
          play_ivr_on_leave: false,                               //参会者离开时播放提示音
          play_ivr_on_join: false,                                //有新的与会者加入时播放提示音
          live_url: false                                         //开启直播
      }
    }
    
    meeting_api.create_meeting(create_params)
    .then((result) => {
      var newMeeting = {
        MeetingID: result.meeting_info_list[0].meeting_id,	              //会议ID - 自动生成ID
        MeetingDesc: req.body.MeetingDesc,	          //会议名称
        Status: req.body.Status,	                    //状态 - 0关闭/1开放
        StartTime: db.convertLocalTime(req.body.StartTime),	              //开始时间
        EndTime: db.convertLocalTime(req.body.EndTime),                	  //结束时间
        IsRecurrent: req.body.IsRecurrent,	          //周期性会议 - 0/1
        Room: req.body.Room,	                        //会议地点
        Comments: req.body.Comments,	
        Password: req.body.Password,	                //保密
        AttendNum: req.body.AttendNum,	              //会议人数上限
        AttendInvite: req.body.AttendInvite,	        //邀请
        SpecialGuest: req.body.SpecialGuest,	        //嘉宾 - 0/1
        SpecialGuestList: req.body.SpecialGuestList,	//嘉宾名单, 打钩之后出现
        AssignedHost: req.body.AssignedHost,	        //指定主持人
        Layout: req.body.Layout,	                    //布局
        WaitingRoom: req.body.WaitingRoom,	          //开启等候室 - 0/1
        JoinBeforeHost: req.body.JoinBeforeHost,	    //允许在主持人进入会议前加入 - 0/1
        JoinMute: req.body.JoinMute,	                //加入时自动静音 - 0/1
        WaterPrint: req.body.WaterPrint,	            //开启水印 - 0/1
        InsideOrg: req.body.InsideOrg,	              //入会成员设置 - 0/1
        AttendFileUpload: req.body.AttendFileUpload	, //允许成员上传文档 - 0/1
        Simultaneous: req.body.Simultaneous,        	//同声传译 - 0/1
        LiveStream: req.body.LiveStream,            	//直播 - 0/1
        MeetingLink: result.meeting_info_list[0].join_url,
        MeetingCode: result.meeting_info_list[0].meeting_code,
        CreateDt: db.convertLocalTime(req.body.CreateDt),
        ModifyDt: null
      }
      Meeting.create(newMeeting)

      res.status(200).send({
        code: 200,
        message: 'Meeting创建成功'
      })
      logger.logger.info("Create Meeting: "+req.body.MeetingID)
      console.log('create meeting ok, response:\n',  JSON.stringify(result, null, 4));
    })
    .catch((error) => {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Create Meeting fail: "+req.body.MeetingID+'/'+error)
      console.log(error);
    });    
  },
  async update (req, res) {
    var hosts = []
    req.body.AssignedHost.split(',').forEach(host => {
      hosts.push({userid:host})
    });
    var invitees = []
    req.body.AttendInvite.split(',').forEach(invitee => {
      invitees.push({userid:invitee})
    });

    var update_params = {
      meeting_id: req.body.MeetingID,
      modify_meeting_req: {
        subject: req.body.MeetintDesc, 
        userid: req.body.UserID,    
        instanceid: 1,                                              //用户的终端设备类型。[1:PC, 2:Mac, 3:Android, 4:iOS, 5:Web, 6:iPad, 7:Android Pad, 8:小程序]
        hosts: hosts,                                           //会议主持人的用户 ID，如果没有指定，主持人将被设定为上文的 userid，即 API 调用者。
        invitees: invitees,
        start_time: Math.floor(Date.parse(req.body.StartTime) / 1000) + '',             //预约会议的开始时间(以秒为单位的标准时间戳)
        end_time: Math.floor(Date.parse(req.body.EndTime) / 1000) + '',        //预约会议的结束时间(以秒为单位的标准时间戳)
        password: req.body.Password,                                          
        settings: {                                                 
          mute_enable_join: req.body.JoinMute,                                   //入会时静音
          allow_unmute_self: false,                                 //允许参会者取消静音
          mute_all: false,                                          //全体静音 
          host_video: true,                                         //主持人视频
          participant_video: false,                                 //参会者视频
          enable_record: false,                                     //开启录播
          play_ivr_on_leave: false,                                 //参会者离开时播放提示音
          play_ivr_on_join: false,                                  //有新的与会者加入时播放提示音
          live_url: false                                           //开启直播
        }
      },
    }

    meeting_api.modify_meeting(update_params.meeting_id, update_params.modify_meeting_req)
    .then((result) => {
      var newMeeting = {
        MeetingDesc: req.body.MeetingDesc,	          //会议名称
        Status: req.body.Status,	                    //状态 - 0关闭/1开放
        StartTime: req.body.StartTime,	              //开始时间
        EndTime: req.body.EndTime,                	  //结束时间
        IsRecurrent: req.body.IsRecurrent,	          //周期性会议 - 0/1
        Room: req.body.Room,	                        //会议地点
        Comments: req.body.Comments,	
        Password: req.body.Password,	                //保密
        AttendNum: req.body.AttendNum,	              //会议人数上限
        AttendInvite: req.body.AttendInvite,	        //邀请
        SpecialGuest: req.body.SpecialGuest,	        //嘉宾 - 0/1
        SpecialGuestList: req.body.SpecialGuestList,	//嘉宾名单, 打钩之后出现
        AssignedHost: req.body.AssignedHost,	        //指定主持人
        Layout: req.body.Layout,	                    //布局
        WaitingRoom: req.body.WaitingRoom,	          //开启等候室 - 0/1
        JoinBeforeHost: req.body.JoinBeforeHost,	    //允许在主持人进入会议前加入 - 0/1
        JoinMute: req.body.JoinMute,	                //加入时自动静音 - 0/1
        WaterPrint: req.body.WaterPrint,	            //开启水印 - 0/1
        InsideOrg: req.body.InsideOrg,	              //入会成员设置 - 0/1
        AttendFileUpload: req.body.AttendFileUpload	, //允许成员上传文档 - 0/1
        Simultaneous: req.body.Simultaneous,        	//同声传译 - 0/1
        LiveStream: req.body.LiveStream,            	//直播 - 0/1
        //MeetingLink: result.meeting_info_list[0].join_url,
        //MeetingCode: result.meeting_info_list[0].meeting_code,
        ModifyDt: req.body.ModifyDt
      }
      Meeting.update(newMeeting,{where:{MeetingID: req.body.MeetingID}})
      
      res.status(200).send({
        code: 200,
        message: 'Meeting更新成功'
      })
      logger.logger.info("Update Meeting: "+req.body.MeetingID)
      console.log('update meeting ok, response:\n',  JSON.stringify(result, null, 4));
    })
    .catch((error) => {
      res.status(500).send({
        code: 500,
        error: '程序异常: ' + error
      })
      logger.logger.fatal("Update Meeting fail: "+req.body.MeetingID+'/'+error)
    });
  },

  async close (req, res) {
    var params = {
      meeting_id: req.body.MeetingID,  //有效的会议 ID。
      userid: req.body.UserID, //调用方用于标示用户的唯一 ID（例如企业用户可以为企业账户英文名、个人用户可以为手机号等）。
      instanceid: 1,   //用户的终端设备类型。[1:PC, 2:Mac, 3:Android, 4:iOS, 5:Web, 6:iPad, 7:Android Pad, 8:小程序]
      reason_code: req.body.ReasonCode, //原因代码，可为用户自定义。
      reason_detail: req.body.ReasonDetail //详细取消原因描述, 可为自定义。
    };

    meeting_api.cancel_meeting(params.meeting_id, params.userid, params.instanceid, params.reason_code, params.reason_detail)
    .then((result) => {
      Meeting.update({Status:0,ModifyDt:req.body.ModifyDt},{where:{MeetingID: req.body.MeetingID}})
      res.status(200).send({
        message: 'Close Meeting: '+req.body.MeetingID
      })
      logger.logger.info("Close Meeting: "+req.body.MeetingID)
      console.log('cancel by id ok, meeting_id:\n',  JSON.stringify(result, null, 4));
    })
    .catch((error) => {
      res.status(500).send({
        code: 500,
        error: '数据删除失败: ' + error
      })
      logger.logger.fatal("Close Meeting fail: "+req.body.PushID+'/'+error)
      console.log(error);
    });
  }
}
