<template>
  <div class='main'>
    <el-row>
      <el-col>
        <div class='top'>
          <div class="title">
            <h3>
            Lilly Wechat - My Content
            </h3>
          </div>
          <div class='Button'>
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd">Create a New Paper</el-button>
            <el-button type="primary" icon="el-icon-plus">Upload Content</el-button>
          </div>
        </div>
        <div class='content'>
          <div class="block">
              <span class="demonstration">Please select date range </span>
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
          </div>
          <div class="searchBox">
            <el-input prefix-icon="iconfont icon-sousuo" v-model="searchTableInfo" placeholder="请输入搜索内容"></el-input>
          </div> 
        </div>  

          <el-table 
            :model="ContentForm"
            :data="getList.slice((pageNum-1)*pageSize,pageNum*pageSize)" border
            :header-cell-style="tableHeaderColor" 
            @sort-change="changeTableSort" class="formSE"
            >
            <el-table-column min-width="5%" prop="ContentID" label="ContentID"></el-table-column>
            <el-table-column min-width="5%" prop="SearchTerm" label="SearchTerm" ></el-table-column>
            <el-table-column min-width="5%" prop="ContentCategory" label="ContentCategory"></el-table-column>
            <el-table-column min-width="5%" prop="ShortTitle" label="ShortTitle"></el-table-column>
            <!-- <el-table-column min-width="5%" prop="ContentMessage" label="ContentMessage"></el-table-column> -->
            <el-table-column min-width="5%" prop="SEID" label="SEID"></el-table-column>
            <el-table-column min-width="5%" prop="CreateDT" label="CreateDT"></el-table-column>
            <el-table-column min-width="5%" prop="ModifyDT" label="ModifyDT"></el-table-column>
            <el-table-column min-width="6%" label="Operation">
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
              :total= "getList.length">
            </el-pagination>
          </div>
        
        </el-col>
      </el-row>
      <!--增加Content页面-->
      <el-dialog title ="Create a New Paper" :visible.sync="dialogCreateVisible" v-if="dialogCreateVisible" class="dialogContent" :modal-append-to-body="false">
          <el-form 
          ref="AddContentForm"
          :model="AddContentForm" 
          :rules="addContentFormRules"  
          label-width="130px"
          >
            <el-row>
              <el-col class="el-col_Content">
                <el-form-item label="SE" prop="SEID">
                  <el-select v-model="AddContentForm.SEID" clearable placeholder="请选择" style="width:100%;padding-left:0px">
                    <el-option
                      v-for="item in getSEListAll" :key="item.SEID" :label="item.SEName" :value="item.SEID">
                    </el-option>
                  </el-select> 
                </el-form-item>
              <el-form-item label="Content Category" prop="ContentCategory">
                  <div>
                  <el-select v-model="AddContentForm.ContentCategory"  placeholder="请选择" style="width:90%;padding-left:0px">
                    <el-option
                      v-for="item in getCategoryList" :key="item.CategoryID" :label="item.CategoryDesc" :value="item.CategoryID">
                    </el-option> 
                    </el-select> 
                    <el-button  class="button-new-tag" size="small" @click="showInput">+ </el-button>
                  </div>
                </el-form-item>
                   <el-tag
                    :key="tag"
                    v-for="tag in dynamicTags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                   </el-tag>
                <el-form-item label="Short Title" prop="ShortTitle">
                  <el-input v-model="AddContentForm.ShortTitle" ></el-input>
                </el-form-item>
                <el-form-item label="Search Term" prop="SearchTerm" >
                  <el-input v-model="AddContentForm.SearchTerm"></el-input>
                </el-form-item> 
                <el-form-item label="Upload PDF">
                  
                  
                  <el-row>
                    <el-col :span="5">
                      <el-upload
                        ref="upload"
                        action=""
                        :show-file-list="true"
                        :before-upload="beforeUpload"
                        style="float:left">
                        <el-button slot="trigger">Choose file</el-button>
                      </el-upload>
                    </el-col>
                    <el-col :span="19">
                      <el-input v-model="AddContentForm.UpdatePDFName"  :disabled="true"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="Content" prop="ContentMessage">
                  <div>
                    <UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue"></UE>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="margin-right:10px" slot="footer">
            <el-button @click.native="createSubmit"  type="primary">Submit</el-button>
         </div>
         <!-- <div style="margin-right:10px" slot="footer" class="dialog-footer">
            <el-button @click.native="createSubmit" v-if="formStatus==1"  type="primary">Submit</el-button>
            <el-button @click.native="updateSubmit" v-if="formStatus!=1"  type="primary">Submit</el-button>
         </div> -->

      </el-dialog>
  </div>
</template>

<script src="Content/jquery-1.9.1.min.js"></script>
<script src="Content/vue/dist/vue.js"></script>

<script>
import SEService from "../../services/SEService";
import MLService from "../../services/MLService";
import GeneralService from "../../services/GeneralService";
import UE from '../../components/ue/ue.vue';
// import MyContentService from "../../services/MyContentService";
import ContentService from "../../services/ContentService";

export default {
  mounted() {
    this.getDetailList();
    this.getCategoryListData();
    this.getSEList();
  },  
  components: {UE},
  data(){
    return {
      pageNum:1,//table第几页
      pageSize:1,  
      defaultMsg:"",
      config: {
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 初始容器高度
        initialFrameHeight: 300,
        // 工具栏是否可以浮动
        autoFloatEnabled: false,
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
      },
      ue1: "ue1", // 不同编辑器必须不同的id
      ue2: "ue2",
      formStatus:0, 
      getSEListAll:[],
      dialogCreateVisible: false,
       dynamicTags:['标签','222','333'],
        value:'',
        ContentForm:{
          ContentID:"",
          SearchTerm:"",
          ContentCategory:"",
          ShortTitle:"",
          ContentMessage:"",
          SEID:"",
          CreateDT:"",
          ModifyDT:"",
        },
      AddContentForm: {
        SEID:"",
        ContentCategory:"",
        ShortTitle: "",
        SearchTerm: "",
        UpdatePDF: null,
        UpdatePDFName: '',
        UpdatePDFData:'',
        Content: "",
        // file:null,
        // fileName:'',
        // fileData:null
      },
      addContentFormRules: {
        ShortTitle: [
          { required: true, message: '请输入Short Title', trigger: 'blur'},
        ],
        SearchTerm: [
          { required: true, message: '请输入Search Team', trigger: 'blur'}
        ],
      },
       pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: '',
        value2: '',

        getSearchInfo:[], 
       searchTableInfo:"",
        AddForm: {
                SE:"",
                Category:"",
                ShortTile: "",
                CreateDate: "",
                ModifyDate: ""
              },
     };
  },
  methods: {
     handleClose(){            
      //resetFields将form重置到mounted之后的状态, 对于编辑页面不适用
      //this.$refs.AddSEForm.resetFields()   
      this.AddContentForm = {
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
    
     handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
     showInput() {
       //获取input中的值
       //当鼠标失去焦点时，将值放进数组中
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
    
     getCategoryListData() {
      ContentService.getCategoryList()
        .then((res) => {
          this.getCategoryList = res;
            //console.log("-=====-"+JSON.stringify(this.getCategoryList))
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    getDetailList() {
       ContentService.getList("")
        .then((res) => {
          this.getSearchInfo = res.data;
        })
        .catch(function (err) {
          console.log("err"+err);
        });
    },
    getSEList() {
      SEService.getSEList("")
        .then((res) => {
          this.getSEListAll = res.data;
          //console.log("getSEListAll:" + JSON.stringify(this.getSEListAll));
        })
        .catch(function (err) {
          console.log("err"+err);
        });
    },
     handleSizeChange(pageSize){
      this.pageSize = pageSize      
    },
     handleCurrentChange(pageNum){
      this.pageNum = pageNum
    },
     handleEdit(row) {
      this.dialogCreateVisible = true;
        this.AddContentForm = {
        SEID:row.SEID,
        SEName:row.SEName,
        CityID: row.CityID,
        HospitalID: row,
        DepID: row,
        MLID: row,
        TeamID: row
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
    changeTableSort(column){
      console.log(column); 
      //获取字段名称和排序类型
      var fieldName = column.prop;
      var sortingType = column.order;

      //如果字段名称为“创建时间”，将“创建时间”转换为时间戳，才能进行大小比较
      if(fieldName=="createTime"){
        this.getList.map(item => {
          item.createTime = this.$moment(item.createTime).valueOf();
        });
      }          
          
      //按照降序排序
      if(sortingType == "descending"){
        this.getList = this.getList.sort((a, b) => //b[fieldName] - a[fieldName]
          b[fieldName].localeCompare(a[fieldName])
        );
      }
      //按照升序排序
      else{
        this.getList = this.getList.sort((a, b) => //a[fieldName] - b[fieldName]
          a[fieldName].localeCompare(b[fieldName])
        );
      }

      //如果字段名称为“创建时间”，将时间戳格式的“创建时间”再转换为时间格式
      if(fieldName=="createTime"){
        this.getList.map(item => {
          item.createTime = this.$moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      }
      
      console.log(this.getList);      
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return "color:#0c0c0c;font-wight:100;font-size:15px;text-align:left";
    },
    handleAdd() {
    this.dialogCreateVisible = true;
      this.AddContentForm = {
        SEID:"",
        ContentCategory:"",
        ShortTitle: "",
        SearchTerm: "",
        UpdatePDF: null,
        UpdatePDFName: '',
        UpdatePDFData:'',
        ContentMessage: "",
      };
    },
    beforeUpload(UpdatePDF) {
      this.AddContentForm.UpdatePDF = UpdatePDF;
      this.AddContentForm.UpdatePDFName = UpdatePDF.name;
      // this.fileSize = file.size;
      const extension = UpdatePDF.name.split(".").slice(-1) == "pdf";
      if (!extension) {
        this.$message.warning("上传模板只能是pdf格式!");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(UpdatePDF);
      let that = this;
      reader.onload = function () {
        that.AddContentForm.UpdatePDFData = reader.result;
      };
      return false; // 返回false不会自动上传
    },
    async createSubmit() {
      //获取富文本框内容
      this.AddContentForm.ContentMessage = this.$refs.ue.getUEContent(); // 调用子组件方法
      //获取当前系统时间
      var myDate = new Date()
      var month = myDate.getMonth() <= 9 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
      var day = myDate.getDate() <= 9 ? '0' + (myDate.getDate()) : myDate.getDate()
      var dataToDate = myDate.getFullYear() + '-' + month + '-' + day
      var hours1 = myDate.getHours() <= 9 ? '0' + (myDate.getHours()) : myDate.getHours() // 获取系统时，
      var minutes1 = myDate.getMinutes() <= 9 ? '0' + (myDate.getMinutes()) : myDate.getMinutes() // 分
      var seconds1 = myDate.getSeconds() <= 9 ? '0' + (myDate.getSeconds()) : myDate.getSeconds() // 秒
      var createDate = myDate.getFullYear() + '-' + month + '-' + day + ' ' + hours1 + ':' + minutes1 + ':' + seconds1

        this.$refs.AddContentForm.validate((valid) => {
           if (valid) {
              this.$confirm('确认提交？', '提示', {}).then(async() => {
 
              await ContentService.myContentCreate(
                {
                  // ContentID: "100004",
                  SEID: this.AddContentForm.SEID,
                  SearchTerm: this.AddContentForm.SearchTerm,
                  ContentCategory: "1,3",
                  ShortTitle: this.AddContentForm.ShortTitle,
                  ContentMessage: this.AddContentForm.ContentMessage,
                  TimeStamp: createDate
                }
              ).then((res) => {
              
                if (res.code == 200){
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  });
                  this.dialogCreateVisible = false;
                  this.formStatus = 0
                  this.getDetailList()
                  //this.handleClose()
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

  },
  computed: {
      getList () {
        const searchTableInfo = this.searchTableInfo
        if (searchTableInfo) {
          return this.getSearchInfo.filter(data => {
            console.log("success"+data)
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(searchTableInfo) > -1
            })
          })
        }
        return this.getSearchInfo
      },
      
  },
  
};
</script>


<style  lang="scss" scoped>

/deep/.formSE{
  width: 100%;
  .el-table__body{
    table-layout: auto;
  } 
}
.content{
  display: flex;
  justify-content: space-between;
  height: 80px;
  width: 100%;
  align-items: center;
}

.top{
  display: flex;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  background-color:#639eda;
  align-items: center;
  padding-left: 0px;
}
.title{
  width: 15%;
  color: white;
  }

.Button{
    float: right;
    
    text-align: right;
    color: white;
    margin-right:1%;
    font-weight:bold;
}
.searchBox{
  width: 19%;
  float: right;
  padding: 5px;
}

/deep/.dialogContent{
  text-align: left;
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
  .input_UploadPdf{
    padding-left:3%;
    //width:85%;
    background-color:white
  }
  .el-form-item__content{
    line-height: 0px;
  }
 .button-new-tag{
  width:10%;
  padding-left:20px;
  background-color:#639eda;
  color:#fff
  }
  .el-dialog__footer{
    padding-top:0px;
  }
  .el-dialog__body{
    padding: 3% 5% 0px 5%;
  }  
}

  
</style>