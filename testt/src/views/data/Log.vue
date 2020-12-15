<template>
  <div>  
    <h3 class="title">Lilly Wechat - Log Viewer
    </h3>
    <el-container >
        <el-header style="text-align: right; font-size: 12px">
          <el-date-picker
            v-model="value1"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-header>
        <el-container>
          <el-aside width="100px" :span = "1" style="background-color: rgb(238, 241, 246)">
            <el-menu @click="handleAdd">
              <el-menu-item index="1">
                <template slot="title">INFO</template>                  
              </el-menu-item>
              <el-menu-item index="2">
                <template slot="title">ERROR</template>                  
              </el-menu-item>
              <el-menu-item index="3">
                <template slot="title">FATAL</template>                  
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main :span = "23" >
            <el-table :model="LogForm" :data="row" border style="width: 100%" class="table"
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
  dialogCreateVisible: false,
  // addLoading: false,
  mounted() {
    this.getLog();
   },
  getMlListValue:"",
  
  data() {
    return {
    dialogCreateVisible:false, 
    LogForm: {
      recordCount:"",
      type:"",
      logTime: "",
      logLevel: "",
      logContent: ""
    },
    tableLabel: [
        { prop: "log", label: "Content" }
      ],
    row: []
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
    tables: function() {
      console/log('1111111111111')
      var search = '[INFO]'//this.search
      if (search) {
        return this.data.filter(function(dataNews) {
          return Object.keys(dataNews).some(function(key) {
            return String(dataNews[key]).includes(SVGPathSegCurvetoQuadraticSmoothRel)
          })
        })
      }
      return this.data   //返回过滤完的数据
    },


    
    async getLog() {
      /*在这里进行跨域请求*/
      const response = await LogService.getLog({
        date: '2020-12-10',
        type: '',
        operation: 'search',
        logReadFlag: '0'
      }).then((res) => {
        this.row = res.log;
        console.log(res.log)
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