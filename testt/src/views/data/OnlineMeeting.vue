<template>
  <div>
      <el-row>
        <el-col :span="24">
          <h3 class="title" >Meeting List
              <el-button class="NewButton" type="primary" icon="el-icon-plus" @click="handleAdd">Create Meeting</el-button>
          </h3>
          <div class="searchBox">
            <el-input prefix-icon="iconfont icon-sousuo" v-model="searchTableInfo" placeholder="请输入搜索内容"></el-input>
          </div>
          
          <el-table 
          :model="MeetingForm" 
          :data="getMeetingList.slice((pageNum-1)*pageSize,pageNum*pageSize)" border 
          :header-cell-style="tableHeaderColor" 
          @sort-change="changeTableSort" class="formSE"     
          ref="SeTable"
          >
            <el-table-column min-width="8%" prop="MeetingID" label="Id" sortable="custom"></el-table-column>
            <el-table-column min-width="10%" prop="MeetingDesc" label="Title" ></el-table-column>
            <el-table-column min-width="15%" prop="MeetingLink" label="AdminLink(请使用Chrome或Safiri打开)" sortable="custom">
              <template scope="scope">
                <div>
                  <a :href="scope.row.MeetingLink">召开会议</a>
                  <el-button  @click="copyText(scope.row.MeetingLink)" class="copyButton"><i class = "el-icon-document-copy"></i></el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="10%" prop="Status" label="Status" :formatter="statusFormat"></el-table-column>
            <el-table-column min-width="18%" prop="MeetingLink" label="AttachedLink ">
              <template scope="scope">
                  <div>{{scope.row.MeetingLink}}
                    <el-button  @click="copyText(scope.row.MeetingLink)" class="copyButton"><i class = "el-icon-document-copy"></i></el-button>
                  </div>
              </template>
            </el-table-column>
            <el-table-column min-width="15%" prop="CreateDt" label="CreateDate"></el-table-column>
            <!-- <el-table-column min-width="15%" label="操作"  align="center">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.url" placement="top">
                    <el-button type="text" @click="copyText(scope.row)">复制</el-button> 
                </template>
            </el-table-column> -->
            <el-table-column min-width="8%" label="">
              <template slot-scope="scope">
                <el-popover
                    placement="right"
                    trigger="click">
                  <el-image :src="QRurl" date-qrid="245092"></el-image>
                  <el-button size="mini" slot="reference" type="info" @click="generateQR(scope.row.MeetingLink)" plain class="buttonQRCode"><i class="el-icon-picture-outline"></i>Export</el-button>
                </el-popover>
                </template>
            </el-table-column>
            <el-table-column min-width="16%" label="">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="HandleEdit(scope.row)" right-padding="20px" class="buttonEdit" plain><i class="el-icon-edit"></i>Edit</el-button>
                <el-button size="mini" type="info" @click="HandleCancel(scope.row)" plain class="buttonDelete"><i class="el-icon-delete"></i>Cancel</el-button>
              </template>
            </el-table-column>
            <el-table-column min-width="18%" prop="Comments" label="Comments"></el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[1, 5, 10]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total= "getMeetingList.length">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
       <!--增加Meeting页面-->
      <el-dialog :visible.sync="dialogCreateVisible" v-if="dialogCreateVisible" @close="handleClose" :close-on-click-modal="false" class="dialogMeeting">
          <el-form 
          ref="AddMeetingForm"
          :model="AddMeetingForm" 
          :rules="addMeetingFormRules" 
          label-position="left"          
          >
          <!-- :rules="formStatus!=0?addMeetingFormRules:null"  -->
            <el-row>
              <el-col :span="6" class="el-col_NewMettingLeft">
                <p class="toptitle">基本信息</p>
                <p class="h4title">请填写会议基本信息</p>
              </el-col>
              <el-col :span="14" class="el-col_NewMetting">
                <el-form-item label="会议名称" prop="MeetingDesc">
                  <el-input v-model="AddMeetingForm.MeetingDesc" :disabled="formStatus==1?false:true"></el-input>
                </el-form-item>
                <el-row>
                  <p style="text-align:left">开始时间</p>
                  <el-col :span="8">
                    <el-form-item prop="StartDate">
                      <el-date-picker value-format="yyyy-MM-dd" v-model="AddMeetingForm.StartDate" type="date" placeholder="选择日期" class="startDate"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">  
                    <el-form-item lable="开始时间" prop="StartTime">
                      <el-time-select v-model="AddMeetingForm.StartTime" :picker-options="{start: '08:30',step: '00:15',end: '18:30'}" placeholder="选择时间" class="startTime"></el-time-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <p style="text-align:left">结束时间</p>
                  <el-col :span="8">
                    <el-form-item lable ="结束时间" prop="EndDate">
                      <el-date-picker value-format="yyyy-MM-dd" v-model="AddMeetingForm.EndDate" type="date" placeholder="选择日期" class="startDate"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item lable ="结束时间" prop="EndTime">
                      <el-time-select v-model="AddMeetingForm.EndTime" :picker-options="{start: '08:30',step: '00:15',end: '18:30'}" placeholder="选择时间" class="startTime"></el-time-select> 
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item prop="IsRecurrent">
                  <span slot="label">
                   <el-checkbox v-model="AddMeetingForm.IsRecurrent">周期性会议</el-checkbox>
                  </span>
                </el-form-item>
                <el-form-item prop="Room">
                  <p style="text-align:left">会议地点(选填)</p>
                  <el-input v-model="AddMeetingForm.Room" placeholder="请输入会议地点"></el-input>
                </el-form-item>
                <el-form-item prop="Status" style="text-align:left" >
                  <p style="text-align:left">会议状态</p>
                  <el-radio v-model="AddMeetingForm.Status" label="1">Open</el-radio>
                  <el-radio v-model="AddMeetingForm.Status" label="0">Close</el-radio>
                </el-form-item>
                <el-form-item prop="Comments">
                  <p style="text-align:left">备注</p>
                  <el-input v-model="AddMeetingForm.Comments" placeholder="请填写备注"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="6" class="el-col_NewMettingLeft">
                <p class="h2title">保密</p>
                <p class="h4title">成员将需要密码入会</p>
                <!-- <p class="h2title">会议人数上限</p> -->
                <!-- <p class="h4title">同一场议会中允许参会的用户上限</p> -->
                <p class="middletitle">邀请</p>
                <p class="h4title">将改会议添加至被邀请成员的会议列表</p>
                <p class="middletitle">指定主持人</p>
                <p class="h4title">您不在会议时,该邀请成员优先成为主持人</p>
                <p class="middletitle">设置</p>
                <p class="h4title">请勾选相关的会议设置</p>
              </el-col>
              <el-col :span="14" class="el-col_NewMetting"> 
                <el-form-item prop="Password" >
                  <p style="text-align:left">入会密码(选填)</p>
                  <el-input v-model="AddMeetingForm.Password" placeholder="请输入4~6位数字密码"></el-input> 
                </el-form-item>
                <!-- <el-form-item prop="LimitNumber">
                  <el-input v-model="AddMeetingForm.LimitNumber" placeholder="1~2000人"></el-input>
                </el-form-item> -->
                <el-form-item prop="LimitNumber">
                  <p style="text-align:left">邀请成员0/300(选填)</p>
                  <el-input v-model="AddMeetingForm.LimitNumber" placeholder="请输入成员姓名搜索"></el-input>
                </el-form-item>
                <el-form-item prop="AssignedHost">
                  <p style="text-align:left">指定主持人0/10(选填)</p>
                  <el-input v-model="AddMeetingForm.AssignedHost" placeholder="请输入成员姓名搜索"></el-input>
                </el-form-item>
                <el-form-item prop="WaitingRoom" style="text-align:left">
                    <el-checkbox v-model="AddMeetingForm.WaitingRoom">开启等候室</el-checkbox>
                </el-form-item>
                 <el-form-item prop="JoinBeforeHost" style="text-align:left">
                    <el-checkbox v-model="AddMeetingForm.JoinBeforeHost">允许成员在主持人进会前加入会议</el-checkbox>
                </el-form-item>
                 <el-form-item prop="JoinMute" style="text-align:left">
                    <el-checkbox v-model="AddMeetingForm.JoinMute">成员加入会议时自动静音</el-checkbox>
                </el-form-item>
                 <el-form-item prop="WaterPrint" style="text-align:left">
                    <el-checkbox v-model="AddMeetingForm.WaterPrint">开启屏幕水印</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="el-col_NewMettingLeft">
                <!-- <p class="h2title">文档</p> -->
                <!-- <p class="h4title">对本次会议相关的文档进行操作</p> -->
                <!-- <p class="h2title">直播</p>
                <p class="h4title">直播相关的设置项</p> -->
                <p class="h2titlenumber">入会成员设置</p>
                <p class="h4title">请设置允许入会的用户</p>
                <p class="h2title">同声传译</p>
                <p class="h4title">启动后,可配置同传译员</p>
              </el-col>
              <el-col :span="14" class="el-col_NewMetting">
                <!-- <el-form-item prop="aa" >
                  <span slot="label">
                    <el-input v-model="AddSEForm.HospitalID" placeholder="ChooseFile"></el-input>
                    <br><el-checkbox v-model="checked">允许成员上传文档</el-checkbox>
                    <br><br><el-checkbox v-model="checked">开启直播</el-checkbox>
                  </span>  
                </el-form-item> -->
                <el-form-item prop="InsideOrg" style="text-align:left" >
                    <el-radio v-model="AddMeetingForm.InsideOrg" label="0">所有人可入会</el-radio>
                    <el-radio v-model="AddMeetingForm.InsideOrg" label="1">仅企业内部人员可入会</el-radio>  
                </el-form-item>
                <el-form-item prop="Simultaneous" style="text-align:left;margin-top:15%">
                  <el-checkbox v-model="AddMeetingForm.Simultaneous">启用同声传译</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="createSubmit" type="primary">预定</el-button>
            <el-button @click.native="handleClose()"  type="primary" class="returnButton">返回</el-button>
            <!-- <el-button @click.native="updateSubmit" v-if="formStatus!=1"  type="primary">Submit</el-button> -->
         </div>

      </el-dialog>
  </div>
</template>

<script src="Content/jquery-1.9.1.min.js"></script>
<script src="Content/vue/dist/vue.js"></script>

<script>
import SEService from "../../services/SEService";
import MLService from "../../services/MLService";
import GeneralService from "../../services/GeneralService";
import WechatService from "../../services/WechatService";
import MeetingService from "../../services/OnlineMeetingService";

export default {
  inject:['reload'],
  name: "MySE",
  mounted() {
    this.getDetailList();
    this.getMLListData();
  },  
  
  data() {
    return {
      dialogCreateVisible:false,  //详细页面显示/隐藏
      formStatus:0,               //详细页面状态: 0-隐藏/1-新增/2-编辑
      changeFlag:false,           //编辑页面回显/手动选择
      getHosData:[],              //根据city筛选hospital
      getDepData:[],              //根据hospital筛选department
      searchTableInfo:"",         //模糊搜索框
      getSearchInfo:[],           //模糊搜索结果
      pageNum:1,                  //table第几页
      pageSize:5,                 //table每页几条数据
      QRurl:'',                   //动态生成二维码链接 
      Url2:'', 
      value1:'',
      value2:'', 
      checked:'true', 
      SEForm: {                   //table数据源
        SEID:"",
        SEName:"",
        City: "",
        Hospital: "",
        Department: "",
        MLName: "",
        TeamName: ""
      },
      // AddSEForm: {                //详细页面数据源
      //   SEID:"",
      //   SEName:"",
      //   CityID: "",
      //   HospitalID: "",
      //   DepID: "",
      //   MLID: "",
      //   TeamID: ""
      // },
      MeetingForm: {                //详细页面数据源
        MeetingID:"",                 //会议ID - 自动生成ID
        MeetingDesc:"",             //会议名称
        Status:"",                 //状态 - 0关闭/1开放
        StartTime:"",                 //开始时间
        EndTime:"",                 //结束时间
        IsRecurrent:"",             //周期性会议 - 0/1
        Room:"",                     //会议地点
        Comments:"",                
        Password:"",                 //保密
        AttendNum:"",                 //会议人数上限
        AttendInvite:"",             //邀请
        SpecialGuest:"",             //嘉宾 - 0/1
        SpecialGuestList:"",         //嘉宾名单, 打钩之后出现
        AssignedHost:"",             //指定主持人
        Layout:"",                 //布局
        WaitingRoom:"",             //开启等候室 - 0/1
        JoinBeforeHost:"",         //允许在主持人进入会议前加入 - 0/1
        JoinMute:"",                 //加入时自动静音 - 0/1
        WaterPrint:"",             //开启水印 - 0/1
        InsideOrg:"",                 //入会成员设置 - 0/1
        AttendFileUpload:"",         //允许成员上传文档 - 0/1
        Simultaneous:"",             //同声传译 - 0/1
        LiveStream:"",             //直播 - 0/1
        CreateDt:"",
        ModifyDt:""   
      },
      AddMeetingForm: {                //详细页面数据源
        MeetingID:"",                 //会议ID - 自动生成ID
        MeetingDesc:"",             //会议名称
        Status:"",                 //状态 - 0关闭/1开放
        StartTime:"",                 //开始时间
        EndTime:"",                 //结束时间
        IsRecurrent:"",             //周期性会议 - 0/1
        Room:"",                     //会议地点
        Comments:"",                
        Password:"",                 //保密
        AttendNum:"",                 //会议人数上限
        AttendInvite:"",             //邀请
        SpecialGuest:"",             //嘉宾 - 0/1
        SpecialGuestList:"",         //嘉宾名单, 打钩之后出现
        AssignedHost:"",             //指定主持人
        Layout:"",                 //布局
        WaitingRoom:"",             //开启等候室 - 0/1
        JoinBeforeHost:"",         //允许在主持人进入会议前加入 - 0/1
        JoinMute:"",                 //加入时自动静音 - 0/1
        WaterPrint:"",             //开启水印 - 0/1
        InsideOrg:"",                 //入会成员设置 - 0/1
        AttendFileUpload:"",         //允许成员上传文档 - 0/1
        Simultaneous:"",             //同声传译 - 0/1
        LiveStream:"",             //直播 - 0/1
        CreateDt:"",
        ModifyDt:"",
        StartDate:"",                 //开始时间
        EndDate:"",   
      },
      currentTime:"",
      rows: [],                   //SE接口返回数据
      getMLList: [],              //ML接口返回数据
      getTeam: [],                //Team接口返回数据
      getHospital:[],             //Hospital接口返回数据
      getGeoTree:[],              //GeoTree接口返回数据
  
      addMeetingFormRules: {           //详细页面校验规则
        MeetingDesc: [
          { required: true, message: '请填写会议名称', trigger: 'change'}
        ],
        StartDate: [
          { required: true, message: '请输入开始日期', trigger: 'blur'}
        ], 
        StartTime: [
          { required: true, message: '\xa0\xa0\xa0请输入开始时间', trigger: 'blur'}
        ], 
        EndDate: [
          { required: true, message: '请输入结束日期', trigger: 'blur'}
        ], 
        EndTime: [
          { required: true, message: '\xa0\xa0\xa0请输入结束时间', trigger: 'blur'}
        ],  
      },
    };
  },

  watch: {
    'AddSEForm.CityID'(city) {
      if(this.changeFlag){
        city = city[2]
      }
      this.filterHospital(city)
    },
    'AddSEForm.HospitalID'(hospital) {
      this.filterDeparement(hospital)
    }
  },

  methods: {   
    HandleCancel(row){
      MeetingService.MeetingClose({
        "UserID":"admin",
        "MeetingID": row.MeetingID,
        "ReasonCode":1,
        "ReasonDetail":"",
        "ModifyDt": this.currentTime
      })
      .then((res) => {        
        this.getDetailList()
        this.$message({
          type: 'success',
          message: '取消成功!'
        });
      })
      .catch(function (err) {
        console.log("err"+err);
      });
    },
    copyText(row) {
      console.log(row);  //每一行的数据
      this.Url2 = row;  //每一行的某个值，如选中的当前行的url
      //alert("this.Url2:" + this.Url2);
      var oInput = document.createElement('input');     //创建一个隐藏input（重要！）
      oInput.value = this.Url2;    //赋值
      console.log(oInput.value);
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = 'oInput';
      oInput.style.display='none';
      alert('复制成功');
    }, 
    handleChange(flag){
      if(flag=='city'){
        this.AddSEForm.HospitalID = ''
        this.AddSEForm.DepID = ''
      }
      if(flag=='hos'){
        this.AddSEForm.DepID = ''
      }
    },

    //select回调，判断当前下拉框是否展示
    handleChangeFlag(val) {
      if(val){
        this.changeFlag = true
      }  
    },

    async generateQR(SEID){
      var ii = WechatService.getQRCode(SEID).then(url=>
      {
         this.QRurl = url;
         console.log("this.QRurl:" + this.QRurl);
      })
      console.log(ii);      
      //this.QRurl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQHB7zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyWl91b2dTQm9jTEYxVGpEQjF2Y24AAgRTLdxfAwSAOgkA'

    },
    changeTableSort(column){
      //获取字段名称和排序类型
      var fieldName = column.prop;
      var sortingType = column.order;

      //如果字段名称为“创建时间”，将“创建时间”转换为时间戳，才能进行大小比较
      if(fieldName=="createTime"){
        this.getSearchInfo.map(item => {
          item.createTime = this.$moment(item.createTime).valueOf();
        });
      }          
          
      //按照降序排序
      if(sortingType == "descending"){
        this.getSearchInfo = this.getSearchInfo.sort((a, b) => //b[fieldName] - a[fieldName]
          b[fieldName].localeCompare(a[fieldName])
        );
      }
      //按照升序排序
      else{
        this.getSearchInfo = this.getSearchInfo.sort((a, b) => //a[fieldName] - b[fieldName]
          a[fieldName].localeCompare(b[fieldName])
        );
      }

      //如果字段名称为“创建时间”，将时间戳格式的“创建时间”再转换为时间格式
      if(fieldName=="createTime"){
        this.getSearchInfo.map(item => {
          item.createTime = this.$moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      }  
    },
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
    },
    handleSizeChange(pageSize){
      this.pageSize = pageSize      
    },
    tableRowStyle({ row, rowIndex }) {
      return "background-color:;font-size:15px;";
    },
    //设置表头行的样式
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return "color:#0c0c0c;font-wight:100;font-size:15px;text-align:left;white-space: pre-line;";
    },
    handleAdd() {
      this.formStatus = 1
      this.dialogCreateVisible = true;   
    },
    handleEdit(row) {
      this.formStatus = 2
      this.dialogCreateVisible = true;
      this.AddSEForm = {
        SEID:row.SEID,
        SEName:row.SEName,
        CityID: row.CityID,
        HospitalID: row.HospitalID,
        DepID: row.DepartmentID,
        MLID: row.MLID ,
        TeamID: row.TeamID
      };
    },
    handleDelete(SEID){
      SEService.SEDelete({SEID:SEID}).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getDetailList();
      }).catch((error) => {
        this.$message({
          type: 'info',
          message: '已取消新增'+error
        });
      })
    },
    handleClose(){            
      //resetFields将form重置到mounted之后的状态, 对于编辑页面不适用
      //this.$refs.AddSEForm.resetFields()   
      this.AddMeetingForm={                //详细页面数据源
        MeetingID:"",                 //会议ID - 自动生成ID
        MeetingDesc:"",             //会议名称
        Status:"",                 //状态 - 0关闭/1开放
        StartTime:"",                 //开始时间
        EndTime:"",                 //结束时间
        IsRecurrent:"",             //周期性会议 - 0/1
        Room:"",                     //会议地点
        Comments:"",                
        Password:"",                 //保密
        AttendNum:"",                 //会议人数上限
        AttendInvite:"",             //邀请
        SpecialGuest:"",             //嘉宾 - 0/1
        SpecialGuestList:"",         //嘉宾名单, 打钩之后出现
        AssignedHost:"",             //指定主持人
        Layout:"",                 //布局
        WaitingRoom:"",             //开启等候室 - 0/1
        JoinBeforeHost:"",         //允许在主持人进入会议前加入 - 0/1
        JoinMute:"",                 //加入时自动静音 - 0/1
        WaterPrint:"",             //开启水印 - 0/1
        InsideOrg:"",                 //入会成员设置 - 0/1
        AttendFileUpload:"",         //允许成员上传文档 - 0/1
        Simultaneous:"",             //同声传译 - 0/1
        LiveStream:"",             //直播 - 0/1
        CreateDt:"",
        ModifyDt:""   
      },
      this.formStatus = 0 
      this.changeFlag = false
      this.dialogCreateVisible = false;
    },
    statusFormat(row){
      if (row.Status === 1) {
        return "正常";
      } 
      else {
        return "取消";
      }
    },
    getCurrentTime(){
      var myDate = new Date()
      var month = myDate.getMonth() <= 9 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
      var day = myDate.getDate() <= 9 ? '0' + (myDate.getDate()) : myDate.getDate()
      var dataToDate = myDate.getFullYear() + '-' + month + '-' + day
      var hours1 = myDate.getHours() <= 9 ? '0' + (myDate.getHours()) : myDate.getHours() // 获取系统时，
      var minutes1 = myDate.getMinutes() <= 9 ? '0' + (myDate.getMinutes()) : myDate.getMinutes() // 分
      var seconds1 = myDate.getSeconds() <= 9 ? '0' + (myDate.getSeconds()) : myDate.getSeconds() // 秒
      var createDate = myDate.getFullYear() + '-' + month + '-' + day + ' ' + hours1 + ':' + minutes1 + ':' + seconds1
      this.currentTime = createDate;
    },
    async createSubmit() {
      this.getCurrentTime();
      this.$refs.AddMeetingForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交？', '提示', {}).then(async() => {   
            await MeetingService.MeetingCreate(
              {
                  UserID:"admin",
                  MeetingID:"",
                  MeetingDesc:this.AddMeetingForm.MeetingDesc, 
                  Status:  this.AddMeetingForm.Status,
                  StartTime: this.AddMeetingForm.StartDate + "  " +this.AddMeetingForm.StartTime,
                  EndTime:  this.AddMeetingForm.EndDate + "  " +this.AddMeetingForm.EndTime,
                  IsRecurrent: this.AddMeetingForm.IsRecurrent,
                  Room: this.AddMeetingForm.Room,
                  Comments: this.AddMeetingForm.Comments,               
                  Password:  this.AddMeetingForm.Password,
                  AttendNum: this.AddMeetingForm.AttendNum,
                  AttendInvite:this.AddMeetingForm.AttendInvite,
                  SpecialGuest:this.AddMeetingForm.SpecialGuest,
                  SpecialGuestList:this.AddMeetingForm.SpecialGuestList,
                  AssignedHost: this.AddMeetingForm.AssignedHost,
                  Layout:  this.AddMeetingForm.Layout,
                  WaitingRoom: this.AddMeetingForm.WaitingRoom,
                  JoinBeforeHost:this.AddMeetingForm.JoinBeforeHost,
                  JoinMute:this.AddMeetingForm.JoinMute,
                  WaterPrint: this.AddMeetingForm.WaterPrint, 
                  InsideOrg: this.AddMeetingForm.InsideOrg,
                  AttendFileUpload:this.AddMeetingForm.AttendFileUpload,
                  Simultaneous: this.AddMeetingForm.Simultaneous,
                  LiveStream: this.AddMeetingForm.LiveStream,
                  CreateDt: this.currentTime,
                  ModifyDt: ""  
              }
            ).then((res) => {
              if (res.code == 400){
                this.$message({
                  type: 'info',
                  message: res.message
                });
              } 
              if (res.code == 200){
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.dialogCreateVisible = false;
                this.formStatus = 0
                this.getDetailList()
                this.handleClose()
              }              
            })
          }).catch((err) => {
            this.$message({
              type: 'info',
              message: '出错了: '+err
            });
          })
        }
      })
    },

    async updateSubmit(formStatus) {
      this.$refs.AddSEForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交？', '提示', {}).then(async() => { 
            await SEService.SEUpdate(
              {
                SEID: this.AddSEForm.SEID,
                SEName: this.AddSEForm.SEName,
                City: this.AddSEForm.CityID,
                Department: this.AddSEForm.DepID,
                MLName: this.AddSEForm.MLID,
                Team:this.AddSEForm.TeamID
              }
            ).then((res) => {
              if (res.code == 400){
                this.$message({
                  type: 'info',
                  message: res.message
                });
              } 
              if (res.code == 200){
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.dialogCreateVisible = false;
                this.formStatus = 0
                this.getDetailList();
                this.handleClose()
              }                
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消新增'
            });
          })
        }
      })
    },

    getDetailList() {
      MeetingService.getMeetingList("")
        .then((res) => {
          this.getSearchInfo = res.data;
          console.log("this.getSearchInfo:" + JSON.stringify(this.getSearchInfo));
        })
        .catch(function (err) {
          console.log("err"+err);
        });
    },

    //getMLList
    getMLListData() {
      MLService.getMLList()
        .then((res) => {
          this.getMLList = res;
          
        })
        .catch(function (err) {
          console.log(err);
        });
       
    },
  },
  computed: {
      getMeetingList () {
        const searchTableInfo = this.searchTableInfo
        if (searchTableInfo) {
          return this.getSearchInfo.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(searchTableInfo) > -1
            })
          })
        }
        return this.getSearchInfo
      }
    },
};
</script>

<style  lang="scss" scoped>
.title{
    width:100%;
    height:40px;
    background-color:#639eda;
    text-align: left;
    color: white;
    border:  #2daaf3;
    padding-top: 20px;
    margin:0px;
}

.NewButton{
    background-color:#639eda;
    text-align: right;
    color: white;
    float: right;
    margin-top: -10px;
    margin-right:1%;
    font-weight:bold;
}
.copyButton{
  padding-left: 5px;
  padding-top: 5px;
  padding-right: 5px;
  height: 25px;
}
.buttonEdit{
  margin-right:3%;
  width:75px
}
.buttonQRCode{
  margin-right:3%;
  width:75px;
  margin-top:3px;
  padding-left:3%
}
.buttonDelete{
  margin-right:3%;
  width:75px;
  margin-top:3px;
}
body .el-table th.gutter{
  display: table-cell!important;
}
/deep/.formSE{
  width: 100%;
  .el-table__body{
    table-layout: auto;
  } 
}
/deep/.dialogMeeting{
  // .el-dialog__header{
  // text-align: left;
  // padding-left:7%;
  // background-color: #498CDF,
  // };
  .el-form-item__content{
    line-height: 5px;
    position: relative;
    font-size: 14px;
  }
  .el-dialog__title{
    color:#fff;
  };
  .el-dialog__close{
    color:#fff;
  }
  .h2{
    padding-top:9%;
    text-align:left;
  }
  .h2title{
    text-align:left;
    font-size:20px;
    //margin-top:10px;
  }
  .h4title{
    text-align:left;
    font-size:12px;
    margin-top: -5%
  }
  .toptitle{
    text-align:left;
    font-size:20px;
    margin-top:10px;
  }
  .middletitle{
     text-align:left;
     font-size:20px;
     margin-top:15%;
  }
   .h2titlenumber{
    text-align:left;
    font-size:20px;
    margin-top:1px;
  }
} 
.block{
  padding-top: 10px;
}
.el-col_NewMetting{
  margin-left:5%;
  .el-select{
    width:100%
  }
  .el-cascader{
    width:100%
  }
}
.el-col_NewMettingLeft{
  margin-left:5%;
  margin-right:5%;
}
 
.searchBox{
  width: 15%;
  float: right;
  padding: 5px;
}

.startDate{
  width:99%;
  text-align:left;
  float:left;
}
.startTime{
  width:99%;
  margin-left:10%;
  float:left;
}
.lableAddMeeting{
  width:180%
}
.dialog-footer{
  margin-right:10%;
}
.returnButton{
  color:#0d0d0d;
  background-color: #ffffff;
  border-color: rgb(238, 236, 236);
}
</style>