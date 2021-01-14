<template>
  <div>
      <el-row>
        <el-col :span="24">
          <h3 class="title" >Lilly Wechat - My Push
              <el-button class="NewButton" type="primary" @click="handleAdd">New My Push</el-button>
          </h3>
          <div class="searchBox">
            <el-input prefix-icon="iconfont icon-sousuo" v-model="searchTableInfo" placeholder="请输入搜索内容"></el-input>
          </div>
          
          <el-table 
            :model="MyPushForm" 
            :data="getMyPushList.slice((pageNum-1)*pageSize,pageNum*pageSize)" border 
            :header-cell-style="tableHeaderColor" 
            @sort-change="changeTableSort" class="formMyPush"
            ref="SeTable"
          >
            <el-table-column min-width="13%" prop="PushID" label="PushID" sortable></el-table-column>
            <el-table-column min-width="10%" prop="SEID" label="SEID"></el-table-column>
            <el-table-column min-width="15%" prop="Greeting" label="Greetings" ></el-table-column>
            <el-table-column min-width="15%" prop="Categorized" label="Categorized" :formatter="categorizedFormat"></el-table-column>
            <el-table-column min-width="17%" prop="ScheduleDate" label="ScheduleDate"></el-table-column>
            <el-table-column min-width="17%" prop="ScheduleTime" label="ScheduleTime"></el-table-column>
            <el-table-column min-width="15%" prop="Priority" label="Priority" sortable :formatter="priorityFormat"></el-table-column>
            <el-table-column min-width="16%" prop="RequestType" label="RequestType" :formatter="requestTypeFormat"></el-table-column>
            <el-table-column min-width="17%" label="Operation">
              <template>
                <!-- @click="handlePushEdit(scope.row)" -->
                <el-button size="mini" type="primary" right-padding="20px" class="buttonEdit" plain><i class="el-icon-edit"></i>Edit</el-button>
                <el-button size="mini" type="info" plain class="buttonDelete"><i class="el-icon-delete"></i>Delete</el-button>
                <!-- @click="handlePushDelete(scope.row)" -->
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[1, 5, 10]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total= "getMyPushList.length">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
       <!--增加My Push页面-->
      <el-dialog :title ="formStatus==1?'New My Push':'Update My Push'" :visible.sync="dialogCreateVisible" v-if="dialogCreateVisible" @close="handleMyPushClose" :close-on-click-modal="false" class="dialogMyPush">
        <!-- style="width:125%;margin-left:-200px" -->
        <div style="height:50vh;">
          <el-scrollbar style="height:100%;">
            <el-form 
            ref="AddMyPushForm"
            :model="AddMyPushForm" 
            :rules="formStatus!=0?addMyPushFormRules:null"  
            label-width="105px"
            label-position="left"
                      
            >
              <el-row>
                <el-col :span="10" class="el-col_MyPush">
                  <h2 class="h2title">Greeting</h2>
                  <el-form-item label="Select SE" prop="SEID">
                    <el-select v-model="AddMyPushForm.SEID" clearable placeholder="请选择" style="width:100%;padding-left:0px">
                      <el-option
                        v-for="item in getSEListAll" :key="item.SEID" :label="item.SEName" :value="item.SEID">
                      </el-option>
                    </el-select> 
                  </el-form-item>
                  <el-form-item label="Greetings" prop="Greeting" >
                    <el-input v-model="AddMyPushForm.Greeting"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10" class="el-col_MyPushRight">
                  <h2 class="h2title">Settings</h2>
                  <el-form-item label="Categorized" prop="Categorized">
                    <el-radio v-model="AddMyPushForm.Categorized" label="1" style="margin-top:15px">Type1</el-radio>
                    <el-radio v-model="AddMyPushForm.Categorized" label="2" style="margin-top:15px">Type2</el-radio>
                  </el-form-item>
                  <el-form-item label="Scheduled" prop="Scheduled">
                    <el-checkbox v-model="AddMyPushForm.Scheduled" ></el-checkbox>
                  </el-form-item>
                  <el-form-item label="ScheduleDate" prop="ScheduleDate"   v-if="dialogScheduleDate" :visible.sync="dialogScheduleDate"  >
                    <el-input v-model="AddMyPushForm.ScheduleDate"></el-input>
                  </el-form-item>
                  <el-form-item label="ScheduleTime" prop="ScheduleTime"  v-if="dialogScheduleTime" :visible.sync="dialogScheduleTime">
                    <el-input v-model="AddMyPushForm.ScheduleTime"></el-input>
                  </el-form-item>
                  <el-form-item label="Priority" prop="Priority">
                    <el-select v-model="AddMyPushForm.Priority" clearable placeholder="请选择" style="width:100%;padding-left:0px">
                      <el-option
                        v-for="item in getPriorityData" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select> 
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- request type title -->
              <el-row>
                <h2 style="float:left;margin-left:5%">Please specify the request(choose one request type)</h2>
              </el-row>
              <!-- request type checkbox -->
              <el-row>
                <div class = "myPushCheckBox">
                  <el-form-item>
                    <p>
                      <el-radio v-model="AddMyPushForm.RequestType" style="float:left;margin-left:-60px" label="4">Standing Request(s)</el-radio>
                    </p>
                    <p>
                      <el-radio v-model="AddMyPushForm.RequestType" style="float:left;margin-left:-60px" label="5">One Time Request(s)(Please privode below information)</el-radio>
                    </p>
                    <p>
                      <el-radio v-model="AddMyPushForm.RequestType" style="float:left;margin-left:-60px" label="6">Virtual Meeting Request(s)(Please privode below information)</el-radio>
                    </p>
                  </el-form-item>
                </div>
              </el-row>
              <!-- select content button -->
              <el-row>
                <el-button @click.native="selectContent" type="primary" style="float:left;padding-buttom:15px;margin-left:3%">Select Content</el-button>
              </el-row>
              <!-- show table -->
              <el-table 
                :model="ContentForm" 
                :data="getChooseContentData" border 
                :header-cell-style="contentTableHeaderColor"
                class="formMyPush" 
                ref="SeTable"
                style="margin-top:10px;width:95%;margin-left:3%;"
              >
                <el-table-column min-width="10%" prop="SEID" label="SE"></el-table-column>
                <el-table-column min-width="15%" prop="ContentCategory" label="Category" ></el-table-column>
                <el-table-column min-width="20%" prop="ShortTitle" label="Short Title"></el-table-column>
                <!-- <el-table-column min-width="20%" prop="ShortTitle" label="Content Title"></el-table-column> -->
                <el-table-column min-width="16%" prop="SearchTerm" label="Search Term"></el-table-column>
                <!-- <el-table-column min-width="19%" prop="MLName" label="12EQueryName"></el-table-column> -->
                <el-table-column min-width="15%" prop="CreateDt" label="Create Date">
                  <template scope="scope">
                    {{dateFormat(scope.row.CreateDt)}}
                  </template>
                </el-table-column>
                <el-table-column min-width="20%" label="Operation">
                  <template slot-scope="scope">
                    <el-button size="mini" type="info" style="width:12px;margin-left:5px" @click="handleMoveUp(scope.$index,scope.row)" :disabled="scope.$index===0" plain ><i class="el-icon-top" style="margin-left:-6px"></i></el-button>
                    <el-button size="mini" type="info" style="width:12px;margin-left:5px;margin-top:3px" @click="handleMoveDown(scope.$index,scope.row)" :disabled="scope.$index===(getChooseContentData.length-1)" plain ><i class="el-icon-bottom" style="margin-left:-6px"></i></el-button>
                    <el-button size="mini" type="info" style="width:12px;margin-left:5px;margin-top:3px" @click="handleDelete(scope.$index, getChooseContentData)" plain><i class="el-icon-delete" style="margin-left:-6px"></i></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-scrollbar>
        </div> 
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="createSubmit" v-if="formStatus==1"  type="primary">Submit</el-button>
            <el-button @click.native="updateSubmit" v-if="formStatus!=1"  type="primary">Submit</el-button>
         </div>

      </el-dialog>

       <!--选择My Content-->
      <el-dialog title ="请选择Content" 
      :visible.sync="dialogChooseContentVisible" 
      v-if="dialogChooseContentVisible" 
      @close="handleChooseContentClose" 
      :close-on-click-modal="false" 
      class="dialogMyPush">
          <el-form 
          ref="ContentForm"
          :model="ContentForm" 
          label-width="105px"
          label-position="left"          
          >
            <el-row>
              <el-col>
                  <el-transfer
                    :titles="['可选择', '已选择']"
                    v-model="getContentData.ContentID"
                    :data="contentData"
                    style="text-align: left; display: inline-block">
                  </el-transfer>  
              </el-col>
            </el-row>
          </el-form>
          <div style="margin-right:9.5%" slot="footer" >
            <el-button @click.native="contentConfirm" type="primary">Confirm</el-button>
         </div>

      </el-dialog>
  </div>
</template>

<script src="Content/jquery-1.9.1.min.js"></script>
<script src="Content/vue/dist/vue.js"></script>
<script src="//unpkg.com/vue/dist/vue.js"></script>
<script src="//unpkg.com/element-ui@2.14.1/lib/index.js"></script>

<script>
import SEService from "../../services/SEService";
import MLService from "../../services/MLService";
import GeneralService from "../../services/GeneralService";
import WechatService from "../../services/WechatService";
import ContentService from "../../services/ContentService";
import MyPushService from "../../services/MyPushService";


export default {
  inject:['reload'],
  name: "MySE",
  mounted() {
    this.getDetailList();
    this.getSEList();
    this.getContentList(); 
  },  

  data() {
    return {
      dialogCreateVisible:false,  //详细页面显示/隐藏
      dialogChooseContentVisible:false,  //选择Content页面显示/隐藏
      dialogScheduleDate:false,
      dialogScheduleTime:false,
      formStatus:0,               //详细页面状态: 0-隐藏/1-新增/2-编辑
      changeFlag:false,           //编辑页面回显/手动选择
      getHosData:[],              //根据city筛选hospital
      getDepData:[],              //根据hospital筛选department
      searchTableInfo:"",         //模糊搜索框
      getSearchInfo:[],           //模糊搜索结果
      pageNum:1,                  //table第几页
      pageSize:5,                 //table每页几条数据   
      SEForm: {                   //table数据源
        SEID:"",
        SEName:"",
        City: "",
        Hospital: "",
        Department: "",
        MLName: "",
        TeamName: ""
      },
      AddSEForm: {                //详细页面数据源
        SEID:"",
        SEName:"",
        CityID: "",
        HospitalID: "",
        DepID: "",
        MLID: "",
        TeamID: ""
      },
      MyPushForm: {                //详细页面数据源
        PushID:"",
        SEID:"",
        Greeting:"",
        Categorized: "",
        Scheduled: "",
        Priority: "",
        RequestType: "",
        ScheduleDate:"",
        ScheduleTime:"",
        ContentId: ""
      },
      AddMyPushForm: {                //详细页面数据源
        PushID:"",
        SEID:"",
        Greeting:"",
        Categorized: "",
        Scheduled: "",
        Priority: "",
        RequestType: "",
        ScheduleDate:"",
        ScheduleTime:"",
        ContentId: ""
      },
      ContentForm:{
        ContentID:"",
        SearchTerm:"",
        ContentCategory:"",
        ShortTitle:"",
        ContentMessage:"",
        SEID:"",
        CreateDT:"",
        ModifyDT:"",
        UpdatePhotoData:"",
        UpdatePhotoName:"",
        UpdatePhotoPath:"",
      },
      radio: '',
      checked:'',
      getContentData:[],          //ContentList
      getChooseContentData:[],    //被选择的Content
      currentContentID:'',
      getContentIdData:[],        //所有ContentId
      getContentLableData:[],
      contentData:[],
      MyPushID:"",
      newProcessRouteDtos:[],
      getPriorityData:[{
          value: '1',
          label: 'High'
        }, {
          value: '2',
          label: 'Medium'
        }, {
          value: '3',
          label: 'low'
        }],
      isAdd:"true",
      value: [],
      currentTime:"",
      rows: [],                   //SE接口返回数据
      getSEListAll:[],
      addMyPushFormRules: {           //详细页面校验规则
        Greeting: [
          { required: true, message: '请填写Greetings', trigger: 'change'}
        ]    
      },
       //data: this.contentData,
        value: [],
        filterMethod(query, item) {
          return item.this.getContentIdData.indexOf(query) > -1;
        }
    };
  },

  watch: {
    'getContentData.ContentID'(ContentID) {
      this.currentContentID = ContentID;
    },
    'AddMyPushForm.Scheduled'(checked){
      if(checked == true)
      {
          this.dialogScheduleDate = true;
          this.dialogScheduleTime = true;
      }
      else
      {
          this.AddMyPushForm.ScheduleDate = '';
          this.AddMyPushForm.ScheduleTime = '';
          this.dialogScheduleDate = false;
          this.dialogScheduleTime = false;  
      }
    }
  },

  methods: {  
    getSEList() {
      SEService.getSEList("")
        .then((res) => {
          this.getSEListAll = res.data;
        })
        .catch(function (err) {
          console.log("err"+err);
        });
    },
    getContentList() {
      this.getContentData = [];
      this.getContentIdData =[];
      this.getContentLableData =[];
      this.contentData =[];
      ContentService.getList("")
      .then((res) => {
        this.getContentData = res.data;
        for(var item of this.getContentData){
            this.getContentIdData.push(item.ContentID);
            this.getContentLableData.push(item.ContentID);
        }
        this.getContentLableData.forEach((contentId, index) => {
          this.contentData.push({
            label: ""+contentId+"",
            key: ""+contentId+"",
            value:""+contentId+"",
            getContentIdData: ""+this.getContentIdData[index]+"",
          });
        });
      })
      .catch(function (err) {
        console.log("err"+err);
      });
   },
    getID(){
      this.MyPushID = Number(Math.random().toString().substr(3,6) );
    },
    selectContent(){
      this.dialogChooseContentVisible=true;
    },
    contentConfirm(){
      this.filterContent();
      this.dialogChooseContentVisible=false;
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
    //上移
    handleMoveUp(index, row) {
      var that = this
      if (index > 0) {
        // 获取当前点击的上一条数据
        const upDate = that.getChooseContentData[index - 1]
        // 移除上一条数据
        that.getChooseContentData.splice(index - 1, 1)
        // 把上一条数据插入当前点击的位置
        that.getChooseContentData.splice(index, 0, upDate)
      }
    },
    // 下移
    handleMoveDown(index, row) {
      var that = this
      const downDate = that.getChooseContentData[index + 1]
      that.getChooseContentData.splice(index + 1, 1)
      that.getChooseContentData.splice(index, 0, downDate)
    },
    categorizedFormat(row){
      if (row.Categorized === 1) {
        return "Type1";
      } 
      else {
        return "Type2";
      }
    },
    priorityFormat(row){
      if (row.Priority === 1) {
        return "High";
      } 
      else if (row.Priority === 2){
        return "Medium";
      }
      else{
        return "Low";
      }
    },
    requestTypeFormat(row){
      if (row.RequestType === 4) {
        return "Standing Request";
      } 
      else if (row.RequestType === 5){
        return "One Time Request";
      }
      else{
        return "Meeting Request";
      }
    },
    //select回调，判断当前下拉框是否展示
    handleChangeFlag(val) {
      if(val){
        this.changeFlag = true
      }  
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
      return "color:#0c0c0c;font-wight:100;font-size:15px;text-align:left";
    },
    contentTableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return "color:#FFFFFF;background-color:#409EFF;font-wight:100;font-size:15px;text-align:left";
    },
    handleAdd() {
      this.formStatus = 1
      this.dialogCreateVisible = true; 
      this.getID(); 
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
    handleDelete (index, rows) {
        rows.splice(index, 1);
        // this.currentContentID =[];
        // this.getContentIdData = [];
        // this.getContentLableData =[];
        // this.contentData =[];
        
        // for(var i = 0; i<this.getChooseContentData.length;i++)
        // {
        //     var ContentID = this.getChooseContentData[i].ContentID;
        //     this.currentContentID.push(ContentID);
        // } 
        // //重新给contentData赋值
        // //console.log("this.getChooseContentData111111111111:" + JSON.stringify(this.getChooseContentData));
        // // console.log("this.currentContentID11111111:" + this.currentContentID);
        // for(var i = 0; i<this.getChooseContentData.length;i++)
        // {
        //   var existContentId = this.getChooseContentData[i].ContentID;
        //   for(var item of this.getContentData){
        //     var itemContentId = item.ContentID
        //     if(itemContentId == existContentId){

        //     }
        //     else{
        //       if(this.getContentIdData.includes(itemContentId)){
        //           console.log(1)
        //       }
        //       else{
        //         this.getContentIdData.push(itemContentId);
        //       }  
        //       if(this.getContentLableData.includes(itemContentId)){
        //           console.log(2)
        //       }
        //       else{
        //         this.getContentLableData.push(itemContentId); 
        //       }
                
        //     }
        //   }
        // }
        // //console.log("this.getContentIdData:" + JSON.stringify(this.getContentIdData));
        // //console.log("this.getContentLableData:" + JSON.stringify(this.getContentLableData));
        //  this.getContentLableData.forEach((contentId, index) => {
        //   this.contentData.push({
        //     label: ""+contentId+"",
        //     key: ""+contentId+"",
        //     value:""+contentId+"",
        //     getContentIdData: ""+this.getContentIdData[index]+"",
        //   });
        // })
        //console.log("this.contentData:" + JSON.stringify(this.contentData));
    },
    handleMyPushClose(){            
      //resetFields将form重置到mounted之后的状态, 对于编辑页面不适用
      this.AddMyPushForm = {
        SEID:"",
        Greeting:"",
        Categorized: "",
        Scheduled: "",
        Priority: "",
        RequestType: "",
        ScheduleDate:"",
        ScheduleTime:"",
        ContentId: ""
      },
      this.getContentList();
      this.getChooseContentData=[];
      this.currentContentID = [];
      this.formStatus = 0 
      this.changeFlag = false
    },
    handleChooseContentClose(){

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
    async createSubmit(formStatus) {
      this.getCurrentTime();
      this.$refs.AddMyPushForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交？', '提示', {}).then(async() => {  
            let content = []  
            this.getChooseContentData.forEach(ct => {
              content.push(ct.ContentID)
            });
            await MyPushService.myPushCreate(
              {
                  PushID:this.MyPushID,
                  SEID: this.AddMyPushForm.SEID,   
                  Greeting:this.AddMyPushForm.Greeting,
                  Categorized: this.AddMyPushForm.Categorized,
                  Priority:this.AddMyPushForm.Priority,
                  IsScheduled: this.AddMyPushForm.Scheduled,
                  ScheduleDate: this.AddMyPushForm.ScheduleDate,
                  ScheduleTime: this.AddMyPushForm.ScheduleTime,
                  RequestType: this.AddMyPushForm.RequestType,
                  ContentID: content.toString(),//this.AddMyPushForm.ContentId,
                  MeetingID: "",
                  CreateDt: this.currentTime,
                  ModifyDt: "",
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
                this.handleMyPushClose()
                this.currentContentID = ""
                //this.getContentList();
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
                this.handleMyPushClose()
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
      MyPushService.getMyPushList("")
        .then((res) => {
          this.getSearchInfo = res.data;
        })
        .catch(function (err) {
          console.log("err"+err);
        });
    }, 
    filterContent(){
      this.getChooseContentData = []
      for(var i = 0; i<this.currentContentID.length;i++)
      {
        var ContentID = this.currentContentID[i];
        for(var item of this.getContentData){
          var contentId=item.ContentID;
          if(contentId == ContentID){
            this.getChooseContentData.push(item);
          }
        }
      }  
    },
    dateFormat(time) {
      var date=new Date(time);
      var year=date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
        * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
        * */
      var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
      var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
      var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours()-8;
      var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
      var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
      // 拼接
      //return year+"-"+month+"-"+day+" "+hours+":"+minutes;
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds
  },
  },
  computed: {
      getMyPushList () {
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
    padding-left:5px;
}

.NewButton{
    background-color:#639eda;
    text-align: right;
    color: white;
    float: right;
    margin-top: -10px;
    margin-right:1%;
    font-weight:bold;
    border-color:#639eda;
}
.buttonEdit{
  margin-right:3%;
  width:75px;
  margin-top:3px;
}
.buttonQRCode{
  margin-right:3%;
  width:75px;
  margin-top:3px;
  padding-left:3%
}
.buttonDelete{
  width:75px;
  margin-top:3px;
  //padding-left:3%;
  margin-left:0px;
}
body .el-table th.gutter{
  display: table-cell!important;
}
/deep/.formMyPush{
  width: 100%;
  // .el-table__body-wrapper .el_table_body
  // .table__header{
  //     table-layout: auto;
  //     // display: table-cell!important;
  //   }
  .el-table__body{
    table-layout: auto;
  } 
  
}
/deep/.dialogMyPush{
  .el-dialog__header{
  text-align: left;
  padding-left:7%;
  background-color: #498CDF,
  };

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
    text-align:left
  }
   .el-scrollbar__wrap {
    overflow-x: hidden;
    height: 100%;
  }
  .el-scrollbar__thumb {
    overflow-x: hidden;
    height: 0%;
  }
}
 
.block{
  padding-top: 10px;
}

.el-col_MyPush{
  margin-left:5%;
  //padding-right:2%;
  margin-right:3%;
  .el-select{
    width:100%
  }
  .el-cascader{
    width:100%
  }
  .el-radio{
    float:left
  }
  .el-checkbox{
     float:left
  }
  .el-form-item__lable::before{
    margin-left: -8% !important;
  }
}
.el-col_MyPushRight{
  margin-left:6%;
  //padding-right:2%;
  //margin-right:3%;
  .el-select{
    width:100%
  }
  .el-cascader{
    width:100%
  }
  .el-radio{
    float:left
  }
  .el-checkbox{
     float:left
  }
  .el-form-item__lable::before{
    margin-left: -8% !important;
  }
}


.myPushCheckBox{
  width:40%;
  .el-form-item{
      .el-form-item__content{
      //margin-left:10px!important;
      margin-left:5%!important;
    } 
  }
  
} 
.searchBox{
  width: 12%;
  float: right;
  padding: 5px;
  /deep/.el-input--prefix .el-input__inner {
    padding-left: 10px; 
  }
}
.dialog-footer{
  margin-right:2.1%;
}
</style>