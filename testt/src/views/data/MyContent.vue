<template>
<div class='main'>
      <el-row>
        <el-col>
          <div class='top'>
            <div class="title">
              <h3>
              Lilly Wechat - SE List
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
            :data="SEForm" border
            :header-cell-style="tableHeaderColor" 
            @sort-change="changeTableSort" class="formSE"
            >
            <!--:model="SEForm"  :data="getSEList.slice((pageNum-1)*pageSize,pageNum*pageSize)" border -->
            <el-table-column min-width="20%" prop="SE" label="SE" sortable="custom"></el-table-column>
            <el-table-column min-width="20%" prop="Category" label="Category" ></el-table-column>
            <el-table-column min-width="20%" prop="ShortTile" label="ShortTile"></el-table-column>
            <el-table-column min-width="20%" prop="CreateDate" label="CreateDate"></el-table-column>
            <el-table-column min-width="20%" prop="ModifyDate" label="ModifyDate"></el-table-column>
            <el-table-column min-width="20%" label="Operation">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" right-padding="20px" class="buttonEdit" @click="handleEdit(scope.row)" plain><i class="el-icon-edit"></i>Edit</el-button>
                <el-button size="mini" type="info" @click="handleDelete(scope.row.SEID)" plain class="buttonDelete"><i class="el-icon-delete"></i>Delete</el-button>
              </template>
            </el-table-column>
          </el-table> 
<!--
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
          -->
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
                <el-form-item label="SE" prop="SE">
                  <el-select v-model="AddContentForm.SE" clearable placeholder="请选择" style="width:100%;padding-left:0px">
                    <!-- <el-option
                      v-for="itemML in getMLList.data" :key="itemML.MLID" :label="itemML.MLName" :value="itemML.MLID">
                    </el-option> -->
                  </el-select> 
                </el-form-item>
                <el-form-item label="Content Category" prop="ContentCategory">
                  <el-select v-model="AddContentForm.ContentCategory" clearable placeholder="请选择" style="width:100%;padding-left:0px">
                    <!-- <el-option
                      v-for="itemML in getMLList.data" :key="itemML.MLID" :label="itemML.MLName" :value="itemML.MLID">
                    </el-option> -->
                    </el-select> 
                </el-form-item>
                <el-form-item label="Short Title" prop="ShortTitle">
                  <el-input v-model="AddContentForm.ShortTitle" ></el-input>
                </el-form-item>
                <el-form-item label="Search Term" prop="SearchTeam" >
                  <el-input v-model="AddContentForm.SearchTeam"></el-input>
                </el-form-item> 
                <el-form-item label="Upload PDF">
                    <!-- style="width: 200px; display: inline; margin-left: 25px" -->
                    <!-- class="upload-demo" -->
                    <el-upload
                      ref="upload"
                      action=""
                      :show-file-list="true"
                      :before-upload="beforeUpload"
                      style="float:left">
                      <el-button slot="trigger">Choose file</el-button>
                    </el-upload>
                    <el-input v-model="AddContentForm.UpdatePDFName" class="input_UploadPdf" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Content">
                  <div>
                    <!-- <button @click="getUEContent()">获取内容</button>
                    <button @click="getUEContentTxt()">获取无文本内容</button> -->
                    <div class="layui-form-item" style="position: relative;z-index: 10000;">
                      <UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue"></UE>
                    </div>
                  </div>
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
import UE from '../../components/ue/ue.vue';

export default {
  components: {UE},
  data(){
     return {
      //  defaultMsg: '<span style="orphans: 2; widows: 2; font-size: 22px; font-family: KaiTi_GB2312; background-color: rgb(229, 51, 51);"><strong>夏钧姗：成功的投资需具备哪些心态和掌握哪些重要止损位</strong></span>',
        defaultMsg:"",
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 300
        },
        ue1: "ue1", // 不同编辑器必须不同的id
        ue2: "ue2",
       dialogCreateVisible: false,
      AddContentForm: {
        SE:"",
        ContentCategory:"",
        ShortTitle: "",
        SearchTeam: "",
        UpdatePDF: null,
        UpdatePDFName: '',
        UpdatePDFData:'',
        Content: "",
        // file:null,
        // fileName:'',
        // fileData:null
      },
         addContentFormRules: {
        // SEId: [
        //   { required: true, message: '请输入SEId', trigger: 'blur'},
        //   { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
        // ],
        // SEName: [
        //   { required: true, message: '请输入SE Name', trigger: 'blur'}
        // ],
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


       searchTableInfo:"",
        AddForm: {
                SE:"",
                Category:"",
                ShortTile: "",
                CreateDate: "",
                ModifyDate: ""
              },
        SEForm: [{
                SE:"LI",
                Category:"1",
                ShortTile: "A",
                CreateDate: "2020-12-22",
                ModifyDate: "2020-12-22",
              },
              {
                SE:"LI",
                Category:"2",
                ShortTile: "B",
                CreateDate: "2020-12-22",
                ModifyDate: "2020-12-22",
              }],
     };
  },
  methods: {
    getDetailList() {
      SEService.getSEList("")
        .then((res) => {
          //this.getSEList = res.data;
          this.getSearchInfo = res.data;
        })
        .catch(function (err) {
          console.log("err"+err);
        });
    },
     handleEdit(row) {
      this.dialogCreateVisible = true;
        this.SEForm = {
          SE:row.SE,
          Category:row.Category,
          ShortTile: row.ShortTile,
          CreateDate: row.CreateDate,
          ModifyDate: row.ModifyDate,
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
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return "color:#0c0c0c;font-wight:100;font-size:15px;text-align:left";
    },
    handleAdd() {
    this.dialogCreateVisible = true;
      this.AddContentForm = {
        SE:"",
        ContentCategory:"",
        ShortTitle: "",
        SearchTeam: "",
        UpdatePDF: null,
        UpdatePDFName: '',
        UpdatePDFData:'',
        Content: "",
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

  },
  computed: {
      getSEList () {
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
      }
    },
  
};
</script>


<style  lang="scss" scoped>
.el-dialog{
       display: flex;
       flex-direction: column;
       margin:0 !important;
       position:absolute;
       top:50%;
       left:50%;
       transform:translate(-50%,-50%);
       /*height:600px;*/
       max-height:calc(100% - 30px);
       max-width:calc(100% - 30px);
   }
   .el-dialog .el-dialog__body{
       flex:1;
       overflow: auto;
   }

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
  //  width:120%;
  //  display: center;
  //  transform:translate(-50%,-50%);

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
    padding-left:2%;
    width:75%;
    background-color:white
  }
  .el-form-item__content{
    line-height: 0px;
  }
} 
</style>