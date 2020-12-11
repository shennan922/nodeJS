<template>
  <div>
      <el-row>
        <el-col :span="24">
          <h3 class="title">Lilly Wechat - SE List
              <el-button class="NewButton" type="primary" icon="el-icon-plus" @click="handleAdd">New SE</el-button>
          </h3>
          <el-table :model="SEForm" :data="rows1" border style="width: 100%" class="table"
            :row-style="tableRowStyle" :header-cell-style="tableHeaderColor">
            <!-- <el-table-column prop="checkbox">
                <input type="checkbox" v-model='checked' v-on:click='checkedAll'>{{checked}}
            </el-table-column> -->
            <el-table-column prop="SEID" label="ID"></el-table-column>
            <el-table-column prop="SeName" label="SEName" ></el-table-column>
            <el-table-column prop="City" label="City"></el-table-column>
            <el-table-column prop="Hospital" label="Hospital"></el-table-column>
            <el-table-column prop="Department" label="Department"></el-table-column>
            <el-table-column prop="MlName" label="ML"></el-table-column>
            <el-table-column prop="TeamName" label="Team"></el-table-column>
            <el-table-column label="Operation" width="180">
                <el-button size="mini" type="primary" round><i class="el-icon-edit"></i>Edit</el-button>
                <el-button size="mini">QR Code</el-button>
                <el-button size="mini" type="danger" round><i class="el-icon-delete"></i>Delete</el-button>
            </el-table-column>
          </el-table>
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
                       v-for="itemML in getMlList.data" :key="itemML.MLID" :label="itemML.MlName" :value="itemML.MLID">
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
import axios from "axios";

export default {
  name: "MySE",
  dialogCreateVisible: false,
  // addLoading: false,
  mounted() {
    this.getDetailList();
    this.getMlListData();
    this.getTeamData();
    this.getGeoTreeData();
    this.getHospitalData();
  },
  getMlListValue:"",
  
  data() {
    return {
    // value: "",
    dialogCreateVisible:false, 
    SEForm: {
      SEID:"",
      SeName:"",
      City: "",
      Hospital: "",
      Department: "",
      MlName: "",
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
    rows1: [
        // {
        //   SEName: "叶枫",
        //   City: "厦门",
        //   Hospital: "厦门第一医院",
        //   Department: "肿瘤内科",
        //   ML: "张晓冰",
        //   Team: "ONCO_SOUTH",
        // },
        // {
        //   SEName: "孙学军",
        //   City: "大连",
        //   Hospital: "大连医科大学附属第一医院",
        //   Department: "疼痛科",
        //   ML: "朱佳",
        //   Team: "CNS",
        // },
    ],
    getMlList: [
          // {
          //   "MLID": "100001",
          //   "MLName": "王老大"
          // },
          // {
          //   "MLID": "100002",
          //   "MLName": "王老二"
          // },
          // {
          //   "MLID": "100003",
          //   "MLName": "王老三"
          // }
    ],
    getTeam: [
          // {
          //   "TeamID": "1000010",
          //   "TeamName": "ONCO"
          // },
          // {
          //   "TeamID": "1000020",
          //   "TeamName": "DERM"
          // },
          // {
          //   "TeamID": "1000030",
          //   "TeamName": "CNS"
          // }
    ],
   //  "getHospital":{
  //     "value":"",
  //     "NodeDesc":"",
  //     "data":[
  //         {
  //           "level": "1",
  //           "NodeID": "HOS000001",
  //           "NodeDesc": "医大一院",
  //           "ParentNodeID": ""
  //         },
  //         {
  //           "level": "2",
  //           "NodeID": "HOS000100",
  //           "NodeDesc": "骨科",
  //           "ParentNodeID": "HOS000001"
  //         },
  //         {
  //           "level": "2",
  //           "NodeID": "HOS000101",
  //           "NodeDesc": "内科",
  //           "ParentNodeID": "HOS000001"
  //         },
  //         {
  //           "level": "1",
  //           "NodeID": "HOS000002",
  //           "NodeDesc": "医大二院",
  //           "ParentNodeID": ""
  //         },
  //         {
  //           "level": "2",
  //           "NodeID": " HOS000102",
  //           "NodeDesc": "耳鼻喉科",
  //           "ParentNodeID": "HOS000002"
  //         },
  //         {
  //           "level": "2",
  //           "NodeID": " HOS000103",
  //           "NodeDesc": "放射科",
  //           "ParentNodeID": "HOS000002"
  //         }
  //   ]
   //},
   getHospital:[],
   getGeoTree:[
          // {
          //     "level": "1",
          //     "NodeID": "CN000001",
          //     "NodeDesc": "北区",
          //     "ParentNodeID": "",
          //     "children": [
          //         {
          //             "level": "2",
          //             "NodeID": "CN000005",
          //             "NodeDesc": "辽宁省",
          //             "ParentNodeID": "CN000001",
          //             "children": [
          //                 {
          //                     "level": "3",
          //                     "NodeID": "CN000100",
          //                     "NodeDesc": "大连",
          //                     "ParentNodeID": "CN000005"
          //                 },
          //                 {
          //                     "level": "3",
          //                     "NodeID": "CN000101",
          //                     "NodeDesc": "沈阳",
          //                     "ParentNodeID": "CN000005"
          //                 }
          //             ]
          //         }
          //     ]
          // }
      ],
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

    createSubmit() {
      this.$refs.AddSEForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交？', '提示', {}).then(() => {
            // this.addLoading = true;        
              axios
              .post('http://localhost:3008/se/createSE',
                  {
                    SEID: this.AddSEForm.SEId,
                    SeName: this.AddSEForm.SEName,
                    City: "CN000100",
                    // City ："CN000100",
                    Hospital: this.HospitalIDP,
                    Department: this.DepIDP,
                    MLName: this.MLIDP,
                    Team:this.TeamIDP
                  })
              .then((res) => {
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
    getDetailList() {
      /*在这里进行跨域请求*/
      axios
        .get(
          "http://localhost:3008/se/getSeList?Name=",
          {},
          { emulateJSON: true }
        )
        .then((res) => {
          console.log(res.data);
          this.rows1 = res.data.data;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    //getMlList
    getMlListData() {
      axios
        .get(
          "http://localhost:3008/ml/getMlList",
          {},
          { emulateJSON: true }
        )
        .then((res) => {
          //console.log(res.data);
          this.getMlList = res.data;
          //console.log(res.data.value);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    //getTeam
    getTeamData() {
      axios
        .get(
          "http://localhost:3008/general/getTeam",
          {},
          { emulateJSON: true }
        )
        .then((res) => {
          //console.log(res.data);
          //console.log(res.data.data);
          this.getTeam = res.data;

        })
        .catch(function (err) {
          console.log(err);
        });
    },
    //getGeoTree
    getGeoTreeData() {
      axios
        .get(
          "http://localhost:3008/general/getGeoTree?Level=&NodeDesc=",
          {},
          { emulateJSON: true }
        )
        .then((res) => {
          //console.log(res.data);
          //console.log(res.data.data);
          this.getGeoTree = res.data.data;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    //getHospital
    getHospitalData() {
      axios
        .get(
          "http://localhost:3008/general/getHospital?City=",
          {},
          { emulateJSON: true }
        )
        .then((res) => {
          console.log(res.data.value);
          console.log(res.data.data.value);
          this.getHospital = res.data;
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