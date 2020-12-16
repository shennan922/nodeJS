<template>
  <div>
      <el-row>
        <el-col :span="24">
          <h3 class="title">Lilly Wechat - SE List
              <el-button class="NewButton" type="primary" icon="el-icon-plus" @click="handleAdd">New SE</el-button>
          </h3>
          <el-table :model="SEForm" :data="getSEList.slice((pageNum-1)*pageSize,pageNum*pageSize)" border style="width: 100%" class="table"
            :row-style="tableRowStyle" :header-cell-style="tableHeaderColor" 
            @sort-change="changeTableSort">
            <!-- <el-table-column prop="checkbox">
                <input type="checkbox" v-model='checked' v-on:click='checkedAll'>{{checked}}
            </el-table-column> -->
            <el-table-column prop="SEID" label="ID" sortable="custom"></el-table-column>
            <el-table-column prop="SEName" label="SEName" ></el-table-column>
            <el-table-column prop="City" label="City" sortable="custom"></el-table-column>
            <el-table-column prop="Hospital" label="Hospital"></el-table-column>
            <el-table-column prop="Department" label="Department"></el-table-column>
            <el-table-column prop="MLName" label="ML"></el-table-column>
            <el-table-column prop="TeamName" label="Team"></el-table-column>
            <el-table-column label="Operation" width="180">
                <el-button size="mini" type="primary" round><i class="el-icon-edit"></i>Edit</el-button>
                <el-button size="mini">QR Code</el-button>
                <el-button size="mini" type="danger" round><i class="el-icon-delete"></i>Delete</el-button>
            </el-table-column>
          </el-table>
           <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[1, 2, 3, 4]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total= "getSEList.length">
            </el-pagination>
            </div>
        </el-col>
      </el-row>
       <!--增加SE页面-->
      <el-dialog title ="New SE" :visible.sync="dialogCreateVisible">
        <!-- style = "background-color:#639eda" -->
          <el-form 
          ref="AddSEForm"
          :model="AddSEForm" 
          :rules="addSEFormRules"  
          label-width="95px">
            <el-row>
              <el-col style="width:48%;padding-left:10px">
                <h3>General Info</h3>
                <el-form-item label="SEId" prop="SEId" style="width:93%">
                  <el-input v-model="AddSEForm.SEId" style="padding-left:10px"></el-input>
                </el-form-item>
                <el-form-item label="New SE" prop="SEName" style="width:93%">
                  <el-input v-model="AddSEForm.SEName" style="padding-left:10px"></el-input>
                </el-form-item>
                <el-form-item label="ML" prop="MLID">
                  <el-select v-model="AddSEForm.MLID" clearable placeholder="请选择" @change="getMLID($event)">
                    <el-option
                       v-for="itemML in getMLList.data" :key="itemML.MLID" :label="itemML.MLName" :value="itemML.MLID">
                    </el-option>
                  </el-select> 
                </el-form-item>
                <el-form-item label="Team" prop="TeamID">
                  <el-select v-model="AddSEForm.TeamID" placeholder="请选择" @change="getTeamID($event)">
                    <el-option
                       v-for="item in getTeam.data" :key="item.TeamID" :label="item.TeamName" :value="item.TeamID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col style="width:48%; float:right">
                <h3>Geography</h3>
                  <el-tree :data="getGeoTree" show-checkbox node-key="NodeId" :props="defaultProps" @change="getCityID($event)">
                  </el-tree>
                <h3>Hospital</h3>
                <el-form-item label="Hospital" prop="HospitalID">
                  <el-select v-model="AddSEForm.HospitalID" placeholder="请选择"  @change="getHospitalID($event)">
                    <el-option
                       v-for="item in getHospital.data"  :key="item.NodeID" :label="item.NodeDesc" :value="item.NodeID">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- v-if="item.level == 1" -->
                <el-form-item label="Department" prop="DepID">
                   <el-select v-model="AddSEForm.DepID" placeholder="请选择" @change="getDepID($event)">
                    <el-option
                       v-for="item in getHospital.data" :key="item.NodeID" :label="item.NodeDesc" :value="item.NodeID">
                    </el-option>
                  </el-select>
                  <!-- v-if="item.level == 2" -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
           <!-- slot="footer" class="dialog-footer" right -->
          <div style="margin-right:10px" slot="footer" class="dialog-footer">
            <!-- <el-button @click="createReset">Save Draft</el-button> -->
            <el-button @click.native="createSubmit"  type="primary">Submit</el-button>
            <!-- :loading="addLoading" -->
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

export default {
  name: "MySE",
  dialogCreateVisible: false,
  // addLoading: false,
  mounted() {
    this.getDetailList();
    this.getMLListData();
    this.getTeamData();
    this.getGeoTreeData();
    this.getHospitalData();
  },
  getMLListValue:"",
  
  
  data() {
    return {
      dialogCreateVisible:false, 
      pageNum:1,
      pageSize:2,
      SEForm: {
        SEID:"",
        SEName:"",
        City: "",
        Hospital: "",
        Department: "",
        MLName: "",
        TeamName: ""
      },
      AddSEForm: {
        SEId:"",
        SEName:"",
        CityID: "",
        HospitalID: "",
        DepID: "",
        MLID: "",
        TeamID: ""
      },
      rows: [],
      tableLabel: [
          { label: "SEName", prop: "SEName" },
          { label: "City", prop: "City" },
          { label: "Hospital", prop: "Hospital" },
          { label: "Department", prop: "Department" },
          { label: "ML", prop: "ML" },
          { label: "Team", prop: "Team" },
        ],
      getSEList: [],
      getMLList: [],
      getTeam: [],
      getHospital:[],
      getGeoTree:[],
      defaultProps: {
        children: "children",
        label: "NodeDesc",
      },
      MLIDP : "",
      TeamIDP :"",
      CityIDP : "",
      DepIDP : "",
      HospitalIDP: "",
      TeamIDTest :"",
      addSEFormRules: {
        SEId: [
          { required: true, message: '请输入SEId', trigger: 'blur'},
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
  methods: {
    changeTableSort(column){
      console.log(column); 
      //获取字段名称和排序类型
      var fieldName = column.prop;
      var sortingType = column.order;

      //如果字段名称为“创建时间”，将“创建时间”转换为时间戳，才能进行大小比较
      if(fieldName=="createTime"){
        this.getSEList.map(item => {
          item.createTime = this.$moment(item.createTime).valueOf();
        });
      }          
          
      //按照降序排序
      if(sortingType == "descending"){
        this.getSEList = this.getSEList.sort((a, b) => //b[fieldName] - a[fieldName]
          b[fieldName].localeCompare(a[fieldName])
        );
      }
      //按照升序排序
      else{
        this.getSEList = this.getSEList.sort((a, b) => //a[fieldName] - b[fieldName]
          a[fieldName].localeCompare(b[fieldName])
        );
      }

      //如果字段名称为“创建时间”，将时间戳格式的“创建时间”再转换为时间格式
      if(fieldName=="createTime"){
        this.getSEList.map(item => {
          item.createTime = this.$moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      }
      
      console.log(this.getSEList);      
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
    this.dialogCreateVisible = true;
      this.AddSEForm = {
        SEId:"",
        SEName:"",
        City: "",
        Hospital: "",
        Department: "",
        ML: "",
        Team: "",
        checked:""
      };
    },

    async createSubmit() {
      this.$refs.AddSEForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交？', '提示', {}).then(async() => {
            // this.addLoading = true;        
            await SEService.SECreate(
              {
                SEID: this.AddSEForm.SEId,
                SEName: this.AddSEForm.SEName,
                City: "CN000100",
                // City ："CN000100",
                Hospital: this.HospitalIDP,
                Department: this.DepIDP,
                MLName: this.MLIDP,
                Team:this.TeamIDP
              }
            ).then((res) => {
              // console.log(eval("("+res.data+")"));
              // console.log(addPara);
              // console.log(addPara.author);
              console.log(res.data);
              // this.addLoading = false;
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              this.dialogCreateVisible = false;
              //this.getUsers();
              console.log("successful");
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消新增'
            });
          })
        }
        else {
          console.log('error');
          return false;
        }
      })
    },

    async getDetailList() {
      await SEService.getSEList(
          {Name:''},
          { emulateJSON: true }
        )
        .then((res) => {
          this.getSEList = res.data;
        })
        .catch(function (err) {
          console.log(err);
        });
    },

    //getMLList
    async getMLListData() {
      MLService.getMLList(
          { emulateJSON: true }
        )
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
    getMLID(event) {
      this.MLIDP = event;
    },
    getTeamID(event){
      this.TeamIDTest = event;
      this.TeamIDP = event;
    },
    getCityID(event){
      this.CityIDP = event;
    },
    getDepID(event){
      this.DepIDP = event;
    },
    getHospitalID(event){
      this.HospitalIDP = event;
    },
  }
};
</script>

<style  lang="scss" scoped>
@import "@/styles/table.scss";
.title{
    width:100%;
    height:50px;
    background-color:#639eda;
    text-align: left;
    color: white;
    border:  #2daaf3;
}
.NewButton{
    background-color:#639eda;
    text-align: right;
    color: white;
    float: right;
}
.myTable {
  border-collapse: collapse;
  margin: 0 auto;
  text-align: center;
  border: 2px solid #eaeaea;
}
.table th {
  background-color: #eeecec;
  color: #0c0c0c;
}
.tableStyle{
    @include table_format;
    background-color: #98c9fa!important;
    color:#fff;
    font-weight:400;
  }
.el-table th >>> {
    background: #344067;
  }
  .bg_red{background: rgb(252, 108, 56);}

.wrap /deep/ .child-wrap {
    color: red 
  }
  div.el-dialog {
  margin: 0 auto !important;
  top: 50%;
  transform: translateY(-50%);
  .el-dialog__header{  
    background: #0f0f0f;
    text-align: left;   
    font-weight: 600;
  }
}
</style>