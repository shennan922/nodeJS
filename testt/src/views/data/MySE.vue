<template>
  <div>
      <el-row>
        <el-col :span="24">
          <h3 class="title" style="margin-top:0px">Lilly Wechat - SE List
              <el-button class="NewButton" type="primary" icon="el-icon-plus" @click="handleAdd">New SE</el-button>
          </h3>
          <el-table :model="SEForm" :data="getSEList.slice((pageNum-1)*pageSize,pageNum*pageSize)" border style="width: 100%" class="table"
            :header-cell-style="tableHeaderColor" 
            @sort-change="changeTableSort">
            <!-- <el-table-column prop="checkbox">
                <input type="checkbox" v-model='checked' v-on:click='checkedAll'>{{checked}}
            </el-table-column> -->
            <el-table-column min-width="15%" prop="SEID" label="ID" sortable="custom"></el-table-column>
            <el-table-column min-width="15%" prop="SEName" label="SEName" ></el-table-column>
            <el-table-column min-width="15%" prop="City" label="City" sortable="custom"></el-table-column>
            <el-table-column min-width="15%" prop="Hospital" label="Hospital"></el-table-column>
            <el-table-column min-width="15%" prop="Department" label="Department"></el-table-column>
            <el-table-column min-width="15%" prop="MLName" label="ML"></el-table-column>
            <el-table-column min-width="15%" prop="TeamName" label="Team"></el-table-column>
            <el-table-column min-width="25%" label="Operation">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" right-padding="20px" @click="handleEdit(scope.row)" plain><i class="el-icon-edit"></i>Edit</el-button>
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="click">
                    <el-image :src="QRurl"  style="background: rgb(255, 255, 255); width: 200px; display: inline-block; min-height: 200px;" date-qrid="245092"></el-image>
                    <el-button size="mini" slot="reference" type="info" @click="generateQR"  plain ><i class="el-icon-picture-outline"></i>QR Code</el-button>
                  </el-popover>
                  <el-button size="mini" type="info" @click="handleDelete(scope.row.SEID)" plain><i class="el-icon-delete"></i>Delete</el-button>
                </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[1, 2, 4, 8, 10]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total= "getSEList.length">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
       <!--增加SE页面-->
      <el-dialog title ="New SE" :visible.sync="dialogCreateVisible" class="dialogSE">
          <el-form 
          ref="AddSEForm"
          :model="AddSEForm" 
          :rules="addSEFormRules"  
          label-width="95px"
          :label-position="labelPosition"
          >
            <el-row>
              <el-col :span="10" style="margin-left:5%">
                <h3>General Info</h3>
                <el-form-item label="SEId" prop="SEId">
                  <el-input v-model="AddSEForm.SEId" ></el-input>
                </el-form-item>
                <el-form-item label="New SE" prop="SEName" >
                  <el-input v-model="AddSEForm.SEName"></el-input>
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
              <el-col :span="10" style="margin-left:5%">
                <h3>Geography</h3>
                  <!-- <el-tree :data="getGeoTree" show-checkbox node-key="NodeId" :props="defaultProps" @change="getCityID($event)">
                  </el-tree> -->
                  <!-- <el-cascader :options="getGeoTree.data" :show-all-levels="false"></el-cascader> -->
                  <el-form-item label="City" prop="CityID">
                    <el-cascader :options="getGeoTree">
                      <template slot-scope="{ node, data }">
                        <span>{{ data.NodeDesc }}</span>
                      </template>
                    </el-cascader>
                  </el-form-item>
                <h3>Hospital</h3>
                <el-form-item label="Hospital" prop="HospitalID">
                  <el-select v-model="AddSEForm.HospitalID" placeholder="请选择"  @change="getHospitalID($event)">
                    <el-option
                       v-for="item in getHospital.data" :key="item.NodeID" :label="item.NodeDesc" :value="item.NodeID">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Department" prop="DepID">
                   <el-select v-model="AddSEForm.DepID" placeholder="请选择" @change="getDepID($event)">
                    <el-option
                       v-for="item in getDepData" :key="item.NodeID" :label="item.NodeDesc" :value="item.NodeID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="margin-right:10px" slot="footer" class="dialog-footer">
            <el-button @click.native="createSubmit"  type="primary">Submit</el-button>
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
  inject:['reload'],
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
      labelPosition: 'left',
      dialogCreateVisible:false,
      getDepData:[],
      pageNum:1,
      pageSize:8,
      QRurl:'',
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
      getSEList:[],
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
    async generateQR(){

      //this.QRurl = await SEService.generateQR('ayKoHfkba6yaGDHo4vSbcMoXgY6u%2F5P7Zt86IjT%2Bc829cKWpUqbNqKg%2B7Yo%2BmezNhwtNWHFNP%2FKlc1UlxEYzpP9EKcvmC%2F7Y9d0CcR5Je7tAIg4yU5oG1DcaMwXyr03R87%2BwMxzRzVHEYq%2F633iR7M0mcV1bbm9oxU%2BG0qw5sVc%3D')
      this.QRurl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQHB7zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyWl91b2dTQm9jTEYxVGpEQjF2Y24AAgRTLdxfAwSAOgkA'

    },
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
    handleEdit(row) {
    this.dialogCreateVisible = true;
      this.AddSEForm = {
        SEId:row.SEID,
        SEName:row.SEName,
        City: '',
        Hospital: row.Hospital,
        Department: row.Department,
        ML: this.getMLList.find(MLName => MLName = row.MLName) ,
        Team: row.TeamName,
        checked:""
      };
    },
    handleDelete(SEID){
      SEService.SEDelete({SEID:SEID}).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.dialogCreateVisible = false;
        this.getDetailList();
        // this.reload();
        console.log("successful");
      }).catch((error) => {
        this.$message({
          type: 'info',
          message: '已取消新增'+error
        });
      })
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
                // if (res.code === '400 '){
                //   alert("111");
                // } 
              console.log(res.data);
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              this.dialogCreateVisible = false;
              this.getDetailList();
              // this.reload();
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
      SEService.getSEList("")
        .then((res) => {
          this.getSEList = res.data;
        })
        // .catch(function (err) {
        //   console.log("err"+err);
        // });
    },

    //getMLList
    getMLListData() {
      MLService.getMLList()
        .then((res) => {
          this.getMLList = res;
        })
        // .catch(function (err) {
        //   console.log(err);
        // });
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
          console.log("tree:" + res.data.data);
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
      this.getDepData=[];
      // for(var i=0;i<=this.getHospital.data.length;i++){
      //   if(this.getHospital.data[i].ParentNodeID== event){
      //       this.getDepData.push(this.getHospital.data[i]);
      //   }
      // }
      for(var item of this.getHospital.data){
        var parentId=item.ParentNodeID;
        if(parentId == event){
          this.getDepData.push(item);
        }
      }
    },
  }
};
</script>

<style  lang="scss" scoped>
@import "@/styles/table.scss";

.title{
    width:100%;
    height:40px;
    background-color:#639eda;
    text-align: left;
    color: white;
    border:  #2daaf3;
    padding-top: 20px;
}
.NewButton{
    background-color:#639eda;
    text-align: right;
    color: white;
    float: right;
    margin-top: -10px;
}

.tableStyle{
    @include table_format;
    background-color: #98c9fa!important;
    color:#fff;
    font-weight:400;
  }

/deep/.dialogSE .el-dialog__header{
  // text-align: left;
  color:#fff;
  background-color: #498CDF,
}
.block{
  padding-top: 10px;
}

</style>