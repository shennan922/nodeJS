<template>
  <div>
      <el-row>
        <el-col :span="24">
          <h3 class="title" >Lilly Wechat - SE List
              <el-button class="NewButton" type="primary" icon="el-icon-plus" @click="handleAdd">New SE</el-button>
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
            <el-table-column min-width="5%" prop="SEID" type="selection" label="" :reserve-selection="true" >
            </el-table-column>
            <el-table-column min-width="10%" prop="SEID" label="ID" sortable="custom"></el-table-column>
            <el-table-column min-width="15%" prop="SEName" label="SEName" ></el-table-column>
            <el-table-column min-width="15%" prop="City" label="City" sortable="custom"></el-table-column>
            <el-table-column min-width="15%" prop="Hospital" label="Hospital"></el-table-column>
            <el-table-column min-width="15%" prop="Department" label="Department"></el-table-column>
            <el-table-column min-width="15%" prop="MLName" label="ML"></el-table-column>
            <el-table-column min-width="15%" prop="TeamName" label="Team"></el-table-column>
            <el-table-column min-width="25%" label="Operation">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" right-padding="20px" class="buttonEdit" @click="handleEdit(scope.row)" plain><i class="el-icon-edit"></i>Edit</el-button>
                  <el-popover
                    placement="right"
                    trigger="click">
                  <!-- style="background: rgb(255, 255, 255);  display: inline-block;" -->
                  <el-image :src="QRurl" date-qrid="245092"></el-image>
                  <el-button size="mini" slot="reference" type="info" @click="generateQR(scope.row.SEID)"  plain class="buttonQRCode"><i class="el-icon-picture-outline"></i>QR Code</el-button>
                  </el-popover>
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
       <!--增加SE页面-->
      <el-dialog :title ="formStatus==1?'New SE':'Update SE'" :lock-scroll="true" :visible.sync="dialogCreateVisible" v-if="dialogCreateVisible" @close="handleClose" :close-on-click-modal="false" class="dialogSE">
          <el-form 
          ref="AddSEForm"
          :model="AddSEForm" 
          :rules="formStatus!=0?addSEFormRules:null"  
          label-width="95px"
          label-position="left"          
          >
            <el-row>
              <el-col :span="10" class="el-col_NewSE">
                <h2 class="h2title">General Info</h2>
                <el-form-item label="SEID" prop="SEID">
                  <el-input v-model="AddSEForm.SEID" :disabled="formStatus==1?false:true"></el-input>
                </el-form-item>
                <el-form-item label="New SE" prop="SEName" >
                  <el-input v-model="AddSEForm.SEName"></el-input>
                </el-form-item>
                <el-form-item label="ML" prop="MLID">
                  <el-select v-model="AddSEForm.MLID" clearable placeholder="请选择">
                    <el-option
                       v-for="itemML in getMLList.data" :key="itemML.MLID" :label="itemML.MLName" :value="itemML.MLID">
                    </el-option>
                  </el-select> 
                </el-form-item>
                <el-form-item label="Team" prop="TeamID">
                  <el-select v-model="AddSEForm.TeamID" placeholder="请选择" >
                    <el-option
                       v-for="item in getTeam.data" :key="item.TeamID" :label="item.TeamName" :value="item.TeamID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" class="el-col_NewSE">
                <h2 class="h2title">Geography</h2>
                  <el-form-item label="City" prop="CityID">
                    <el-cascader :options="getGeoTree" v-model="AddSEForm.CityID" :props="defaultProps" @visible-change="handleChangeFlag($event)" @change="handleChange('city')">
                    </el-cascader>
                  </el-form-item>
                <h2 class="h2">Hospital</h2>
                <el-form-item label="Hospital" prop="HospitalID">
                  <el-select v-model="AddSEForm.HospitalID" placeholder="请选择"  @change="handleChange('hos')">
                    <el-option
                       v-for="item in getHosData" :key="item.NodeID" :label="item.NodeDesc" :value="item.NodeID">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Department" prop="DepID">
                   <el-select v-model="AddSEForm.DepID" placeholder="请选择" >
                    <el-option
                       v-for="item in getDepData" :key="item.NodeID" :label="item.NodeDesc" :value="item.NodeID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="margin-right:10px" slot="footer" class="dialog-footer">
            <el-button @click.native="createSubmit" v-if="formStatus==1"  type="primary">Submit</el-button>
            <el-button @click.native="updateSubmit" v-if="formStatus!=1"  type="primary">Submit</el-button>
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

export default {
  inject:['reload'],
  name: "MySE",
  mounted() {
    this.getDetailList();
    this.getMLListData();
    this.getTeamData();
    this.getGeoTreeData();
    this.getHospitalData();
  },  
  
  data() {
    return {
      currentTime:"",
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

      addSEFormRules: {           //详细页面校验规则
        SEID: [
          { required: true, message: 'SEID', trigger: 'change'},
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
        ],
        SEName: [
          { required: true, message: '请输入SE Name', trigger: 'blur'}
        ],
        MLID: [
          { required: true, message: '请选择MLName', trigger: 'change'}
        ],
        TeamID: [
          { required: true, message: '请选择Team', trigger: 'change'}
        ],
        CityID: [
          { required: true, message: '请选择所在城市', trigger: 'change'}
        ],
        HospitalID: [
          { required: true, message: '请选择所在医院', trigger: 'change'}
        ],
        DepID: [
          { required: true, message: '请选择所在部门', trigger: 'change'}
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
      return "color:#0c0c0c;font-wight:100;font-size:15px;text-align:left";
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
      this.getCurrentTime();
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
                Team:this.AddSEForm.TeamID,
                CreateDt: this.currentTime
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
                Team:this.AddSEForm.TeamID,
                ModifyDt: this.currentTime
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
          this.getSearchInfo = res.data;
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
    //getTeam
    getTeamData() {
      GeneralService.getTeam(
          { emulateJSON: true }
        )
        .then((res) => {
          this.getTeam = res;

        })
        .catch(function (err) {
          console.log(err);
        });
    },
    //getGeoTree
    getGeoTreeData() {
      GeneralService.getGeoTree(
          {
            Level:'',
            NodeDesc:''
          },
          { emulateJSON: true }
        )
        .then((res) => {
          this.getGeoTree = res.data;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    //getHospital
    getHospitalData() {
      GeneralService.getHospital(
          {City:''},
          { emulateJSON: true }
        )
        .then((res) => {
          this.getHospital = res;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    filterHospital(NodeID){
      this.getHosData = [];
      for(var item of this.getHospital.data){
        var cityId=item.CityID;
        var level=item.Level;
        if(cityId == NodeID && level == 1){
          this.getHosData.push(item);
        }
      }
    },
    filterDeparement(NodeID){
      this.getDepData=[];
      for(var item of this.getHospital.data){
        var parentId=item.ParentNodeID;
        if(parentId == NodeID){
          this.getDepData.push(item);
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
    border-color:#639eda;
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


/deep/.dialogSE{
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
.el-col_NewSE{
  margin-left:5%;
  .el-select{
    width:100%
  }
  .el-cascader{
    width:100%
  }
}
 
.searchBox{
  width: 19%;
  float: right;
  padding: 5px;
  /deep/.el-input--prefix .el-input__inner {
    padding-left: 10px; 
  }
}
</style>