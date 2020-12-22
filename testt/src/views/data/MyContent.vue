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
</div>
</template>

<script src="Content/jquery-1.9.1.min.js"></script>
<script src="Content/vue/dist/vue.js"></script>

<script>
import SEService from "../../services/SEService";
import MLService from "../../services/MLService";
import GeneralService from "../../services/GeneralService";

export default {
  data(){
     return {
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
      this.AddForm = {
        SE:"",
        Category:"",
        ShortTile: "",
        CreateDate: "",
        ModifyDate: "",
        Operation: ""
      };
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
</style>