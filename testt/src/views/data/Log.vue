<template>
  <div>  
    <h3 class="title">Lilly Wechat - Log Viewer
    </h3>
    <el-container >
        <el-aside style="width: 15%">
          <el-table  :data="fileList" border style="width: 100%" class="table"
            :row-style="tableRowStyle" :header-cell-style="tableHeaderColor" height="580px"
            highlight-current-row
            @current-change="onCellClick"
          >
            <el-table-column label="File Name" prop="fileList" sortable="true"></el-table-column>
          </el-table>
        </el-aside>
        <el-container >
          <el-header style="text-align: left; font-size: 12px">
            <el-button size="huge" type="info" @click="typeSearch('ALL')" >ALL</el-button>
            <el-button size="huge" type="info" @click="typeSearch('[INFO]')" >INFO</el-button>
            <el-button size="huge" type="info" @click="typeSearch('[ERROR]')" >ERROR</el-button>
            <el-button size="huge" type="info" @click="typeSearch('[FATAL]')" >FATAL</el-button>
          </el-header>
          <el-main :span = "23" >
            <el-table  :data="row" border style="width: 100%" class="table"
              :row-style="tableRowStyle" :header-cell-style="tableHeaderColor" height="500px">
              <el-table-column label="Content" prop="log"></el-table-column>
            </el-table>
          </el-main>  
        </el-container>       
    </el-container>        
  </div>
</template>

<script src="Content/jquery-1.9.1.min.js"></script>
<script src="Content/vue/dist/vue.js"></script>

<script>
import LogService from "../../services/LogService";

export default {
  name: "Log",
  mounted() {
    this.getList();
  },

  
  data() {
    return {
    fileList:[],
    row: [],
    raw: []
    };
  },

  methods: {
    onCellClick(row){
      console.log(row.fileList)
      this.getLog(row.fileList)
    },
    tableRowStyle({ row, rowIndex }) {
      return "background-color:;font-size:15px;";
    },
    //设置表头行的样式
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return "color:#0c0c0c;font-wight:100;font-size:15px;text-align:left";
    },
    
    typeSearch(search){         
      if(search == 'ALL'){
        var result = this.raw
      }else{
        var result = this.raw.filter(function (e) { return e.log.includes(search)})
      }
      this.row = result
    },

    async getList(){
      await LogService.getFileList()
      .then((res) => {
        this.fileList = res.data;
      })
      .catch(function (err) {
        console.log(err);
      });
    },
    
    async getLog(file) {
      /*
      await LogService.getLog({
        date: '2020-12-10',
        type: '',
        operation: 'search',
        logReadFlag: '0'
      })
      */
      await LogService.getLog({
        fileName:file
      })
      .then((res) => {
        this.row = res.log;
        this.raw = res.log;
      })
      .catch(function (err) {
        console.log(err);
      });
    }
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