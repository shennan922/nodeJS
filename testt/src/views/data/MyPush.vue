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
            :model="SEForm" 
            :data="getSEList.slice((pageNum-1)*pageSize,pageNum*pageSize)" border 
            :header-cell-style="tableHeaderColor" 
            @sort-change="changeTableSort" class="formSE"
              
            :row-key="(row)=>{ return row.SEID}"
            
            ref="SeTable"
          >
            <el-table-column min-width="10%" prop="SEID" label="SEID"></el-table-column>
            <el-table-column min-width="15%" prop="SEName" label="Greetings" ></el-table-column>
            <el-table-column min-width="15%" prop="City" label="Categorized"></el-table-column>
            <el-table-column min-width="15%" prop="Hospital" label="Schedule Date"></el-table-column>
            <el-table-column min-width="15%" prop="Department" label="Schedule Time"></el-table-column>
            <el-table-column min-width="15%" prop="MLName" label="Priority"></el-table-column>
            <el-table-column min-width="15%" prop="TeamName" label="Request Type"></el-table-column>
            <el-table-column min-width="15%" label="Operation">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" right-padding="20px" class="buttonEdit" @click="handleEdit(scope.row)" plain><i class="el-icon-edit"></i>Edit</el-button>
                <el-button size="mini" type="info" @click="handleDelete(scope.row.SEID)" plain class="buttonDelete"><i class="el-icon-delete"></i>Delete</el-button>
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
              :total= "getSEList.length">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
       <!--增加My Push页面-->
      <el-dialog :title ="formStatus==1?'New My Push':'Update My Push'" :visible.sync="dialogCreateVisible" v-if="dialogCreateVisible" @close="handleClose" :close-on-click-modal="false" class="dialogMyPush" style="width:125%;margin-left:-200px;height:600px">
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
                <el-form-item label="Greetings" prop="Greetings" >
                  <el-input v-model="AddMyPushForm.Greetings"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" class="el-col_MyPush">
                <h2 class="h2title">Settings</h2>
                <el-form-item label="Categorized" prop="Categorized">
                  <el-radio v-model="radio" label="1" style="margin-top:15px">Type1</el-radio>
                  <el-radio v-model="radio" label="2" style="margin-top:15px">Type2</el-radio>
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
                  <el-select v-model="AddMyPushForm.SEID" clearable placeholder="请选择" style="width:100%;padding-left:0px">
                    <el-option
                      v-for="item in getSEListAll" :key="item.SEID" :label="item.SEName" :value="item.SEID">
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
                    <el-radio v-model="radio" style="float:left;margin-left:-60px" label="4">Standing Request(s)</el-radio>
                  </p>
                  <p>
                    <el-radio v-model="radio" style="float:left;margin-left:-60px" label="5">One Time Request(s)(Please privode below information)</el-radio>
                  </p>
                  <p>
                    <el-radio v-model="radio" style="float:left;margin-left:-60px;margin-buttom:10px" label="6">Virtual Meeting Request(s)(Please privode below information)</el-radio>
                  </p>
                </el-form-item>
              </div>
            </el-row>
            <!-- select content button -->
            <el-row>
              <el-button @click.native="selectContent" type="primary" style="float:left;padding-buttom:15px">Select Content</el-button>
            </el-row>
            <!-- show table -->
            <el-table 
              :model="ContentForm" 
              :data="getChooseContentData" border 
              :header-cell-style="contentTableHeaderColor"
              class="formSE"  
              :row-key="(row)=>{ return row.SEID}" 
              ref="SeTable"
              style="margin-top:10px"
            >
              <el-table-column min-width="10%" prop="SEID" label="SE"></el-table-column>
              <el-table-column min-width="15%" prop="ContentCategory" label="Category" ></el-table-column>
              <el-table-column min-width="20%" prop="ShortTitle" label="Short Title"></el-table-column>
              <el-table-column min-width="20%" prop="ShortTitle" label="Content Title"></el-table-column>
              <el-table-column min-width="16%" prop="SearchTerm" label="Search Term"></el-table-column>
              <el-table-column min-width="19%" prop="MLName" label="12EQueryName"></el-table-column>
              <el-table-column min-width="15%" prop="CreateDt" label="Create Date"></el-table-column>
              <el-table-column min-width="20%" label="Operation">
                <template slot-scope="scope">
                  <el-button size="mini" type="info" style="width:15px" @click="handleDelete(scope.row.SEID)" plain ><i class="el-icon-top"></i></el-button>
                  <el-button size="mini" type="info" style="width:15px" @click="handleDelete(scope.row.SEID)" plain ><i class="el-icon-bottom"></i></el-button>
                  <el-button size="mini" type="info" style="width:15px" @click="handleDelete(scope.row.SEID)" plain><i class="el-icon-delete"></i></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <div style="margin-right:10px" slot="footer" class="dialog-footer">
            <el-button @click.native="createSubmit" v-if="formStatus==1"  type="primary">Submit</el-button>
            <el-button @click.native="updateSubmit" v-if="formStatus!=1"  type="primary">Submit</el-button>
         </div>

      </el-dialog>

       <!--选择My Content-->
      <el-dialog title ="请选择Content" 
      :visible.sync="dialogChooseContentVisible" 
      v-if="dialogChooseContentVisible" 
      @close="handleClose" 
      :close-on-click-modal="false" 
      class="dialogMyPush">
          <el-form 
          ref="AddMyPushForm"
          :model="AddMyPushForm" 
          label-width="105px"
          label-position="left"          
          >
            <el-row>
              <el-col class="el-col_MyPush">
                <el-form-item label="Select Content" prop="SEID">
                  <el-select v-model="getContentData.ContentID" clearable placeholder="请选择" style="width:40%;padding-left:0px">
                    <el-option
                      v-for="item in getContentData" :key="item.ContentID" :label="item.ContentID" :value="item.ContentID">
                    </el-option>
                  </el-select> 
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="margin-right:10px" slot="footer" class="dialog-footer">
            <el-button @click.native="contentConfirm" type="primary">Confirm</el-button>
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
import ContentService from "../../services/ContentService";

export default {
  inject:['reload'],
  name: "MySE",
  mounted() {
    this.getDetailList();
    this.getSEList1();
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
      QRurl:'',                   //动态生成二维码链接     
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
      AddMyPushForm: {                //详细页面数据源
        SEID:"",
        Greetings:"",
        Categorized: "",
        Scheduled: "",
        Priotity: "",
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
      rows: [],                   //SE接口返回数据
      getMLList: [],              //ML接口返回数据
      getTeam: [],                //Team接口返回数据
      getHospital:[],             //Hospital接口返回数据
      getGeoTree:[],              //GeoTree接口返回数据
      defaultProps: {             //多级下拉菜单赋值
        children: "children",
        label: "NodeDesc",
        value:"NodeID",
      },
      getSEListAll:[],
      addMyPushFormRules: {           //详细页面校验规则
        Greetings: [
          { required: true, message: 'SEID', trigger: 'change'}
        ]    
      },
    };
  },

  watch: {
    // 'AddSEForm.CityID'(city) {
    //   if(this.changeFlag){
    //     city = city[2]
    //   }
    //   this.filterHospital(city)
    // },
    'getContentData.ContentID'(ContentID) {
      //this.filterContent(ContentID)
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
          this.dialogScheduleDate = false;
          this.dialogScheduleTime = false;
      }
    }
  },

  methods: {   
    getSEList1() {
      SEService.getSEList("")
        .then((res) => {
          this.getSEListAll = res.data;
          //console.log("getSEListAll:" + JSON.stringify(this.getSEListAll));
        })
        .catch(function (err) {
          console.log("err"+err);
        });
    },
    getContentList() {
      ContentService.getList("")
      .then((res) => {
        this.getContentData = res.data;
        //console.log("this.getContentData:" + JSON.stringify(this.getContentData));
      })
      .catch(function (err) {
        console.log("err"+err);
      });
   },
    selectContent(){
      this.dialogChooseContentVisible=true;
    },
    contentConfirm(){
      this.filterContent(this.currentContentID)
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
      this.AddSEForm = {
        SEID:"",
        SEName:"",
        CityID: "",
        HospitalID: "",
        DepID: "",
        MLID: "",
        TeamID: ""
      }
      this.formStatus = 0 
      this.changeFlag = false
    },
    async createSubmit(formStatus) {
      this.$refs.AddSEForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交？', '提示', {}).then(async() => {    
            await SEService.SECreate(
              {
                SEID: this.AddSEForm.SEID,
                SEName: this.AddSEForm.SEName,
                City: this.AddSEForm.CityID[2],
                Hospital: this.AddSEForm.HospitalID,
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
      SEService.getSEList("")
        .then((res) => {
          //this.getSearchInfo = res.data;

        })
        .catch(function (err) {
          console.log("err"+err);
        });
    }, 
    filterContent(ContentID){
      for(var item of this.getContentData){
        var contentId=item.ContentID;
        if(contentId == ContentID){
          this.getChooseContentData.push(item);
           console.log("this.getChooseContentData:" + this.getChooseContentData);
        }
      }
    },
  },
  computed: {
      getSEList () {
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
  // .el-table__body-wrapper .el_table_body
  // .table__header{
  //     table-layout: auto;
  //     // display: table-cell!important;
  //   }
  .el-table__body{
    table-layout: auto;
  } 
    
  
  // .table__header{
  //   table-layout: auto;
  // }
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
}
 
.block{
  padding-top: 10px;
}

.el-col_MyPush{
  margin-left:5%;
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
  width: 13%;
  float: right;
  padding: 5px;
}
</style>