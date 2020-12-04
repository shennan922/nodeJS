<template>
  <div style ="margin-left:100px">
    <div class="margin: 0 auto" >
      <el-row :gutter="10">
        <el-col :span="5">
          <h3 style="margin-left:30px">{{isEdit?'第'+(index+1)+'条信息编辑':'信息添加'}}</h3>
          <el-form ref="studentForm" :model="studentForm" :rules="rules" label-width="80px">
            <el-form-item label="姓名" prop="Name">
            <el-input v-model="studentForm.Name"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="Age">
            <el-input v-model.number="studentForm.Age"></el-input>
          </el-form-item>
              <el-form-item label="毕业院校" prop="School">
              <el-select v-model="studentForm.School" placeholder="请选择毕业院校">
                <el-option label="清华大学" :value="1"></el-option>
                <el-option label="北京大学" :value="0"></el-option>
              </el-select> 
            </el-form-item>
            <el-form-item label="备注" prop="Remark">
              <el-input v-model.number="studentForm.Remark" placeholder="请填写备注"></el-input>
            </el-form-item>
            <div style="text-align:center">
              <el-button type="primary" @click="onSubmit('studentForm')">{{isEdit?'提交修改':'添加'}}</el-button>
              <el-button @click="onReset('studentForm')">重置</el-button>
            </div>
          </el-form>
        </el-col>
        <el-col :span="15" :offset="1">
          <h3>列表信息</h3>
          <el-table :data="rows" border style="width: 100%" 
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor">
            <el-table-column prop="Name" label="姓名" ></el-table-column>
            <el-table-column prop="Age" label="年龄"></el-table-column>
            <el-table-column prop="School" label="毕业院校">
              <template slot-scope="scope">{{scope.row.School === 1?'清华大学':'北京大学'}}</template>
            </el-table-column>
            <el-table-column prop="Remark" label="备注"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-col>
      </el-row>
    </div>
    <div>
      <h3>动态加载列表</h3>
      <!-- function1 -->
      <!-- <el-table :data="rows" border style="width: 60%">
        <template v-for="(item, index) in tableLabel">
          <el-table-column
            :key="index"
            :prop="item.prop"
            :label="item.label"
            width="100"
          >
          </el-table-column>
        </template>
        <el-table-column label="详细">
          <template slot-scope="scope">
            <el-button type="info" @click="">详细</el-button>
          </template>
        </el-table-column>
      </el-table> -->

      <!-- function2 -->
      <!-- <table class="myTable table th" border="1">
        <th v-for="(item, index) in columns" :key="index">{{ item.title }}</th>
        <tr v-for="row in rows">
          <td v-for="(idx, i) in row" :key="i">{{ idx }}</td>
        </tr>
      </table> -->
      <!-- function3 prop:对应对象中的键名即可填入数据,lable:来定义表格的列名-->
      <div style="width: 820px; margin: 0 auto">
        <el-table
          :data="rows1"
          :border="true"
          :stripe="true"
          :row-style="tableRowStyle"
          :header-cell-style="tableHeaderColor"
          style="width: 100%"
        >
          <template v-for="(item, index) in columns">
            <el-table-column
              :key="index"
              :prop="item.title"
              :label="item.title"
            >
            </el-table-column>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script src="Content/jquery-1.9.1.min.js"></script>
<script src="Content/vue/dist/vue.js"></script>

<script>
import axios from "axios";

export default {
  name: "Demo",
  mounted() {
    this.queryuser();
  },
  data() {
    return {
      studentForm: {
        Id:"",
        Name: "",
        Age: "",
        School: 1,
        Remark: ""
      },
      msg: "Demo.js App",
      rows: [],
      tableLabel: [
        { label: "名称", prop: "Name" },
        { label: "年龄", prop: "Age" },
        { label: "毕业学校", prop: "School" },
        { label: "备注", prop: "Remark" },
      ],
      rows1: [
        {
          Id: 1,
          Name: "小明",
          Age: 18,
          School: "光明小学",
          Remark: "三好学生",
        },
        {
          Id: 2,
          Name: "小刚",
          Age: 20,
          School: "复兴中学",
          Remark: "优秀班干部",
        },
        {
          Id: 3,
          Name: "吉姆格林",
          Age: 19,
          School: "光明小学",
          Remark: "吉姆做了汽车公司经理",
        },
      ],
      columns: [],
       rules: {
        Name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        Age: [
          {
            required: true,
            type: "number",
            message: "年龄必须为数字值",
            trigger: "blur"
          }
        ],
      },
      isEdit: false,
      index: null
    };
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return "background-color:;font-size:15px;";
    },
    //设置表头行的样式
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return "background-color:#639eda;color:#fff;font-wight:500;font-size:20px;text-align:center";
    },
    queryuser() {
      /*在这里进行跨域请求*/
      axios
        .get(
          "http://localhost:3002/students/list",
          {},
          { emulateJSON: true }
        )
        .then((res) => {
          //console.log(res.data.data);
          this.rows = res.data.user;
    
          var temp = this.rows1[0];
          for (var key in temp) {
            this.columns.push({
              title: key,
            });
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    onSubmit: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const student = {
            Id:"",
            Name: this.studentForm.Name,
            Age: this.studentForm.Age,
            School: this.studentForm.School,
            Remark: this.studentForm.Remark
          };
          if (this.isEdit) {
            this.rows.splice(this.index, 1, student);
            this.isEdit = false;
          } else {
            this.rows.push(student);
          }
          this.$refs['studentForm'].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleEdit(index, data) {
      this.index = index;
      this.isEdit = true;
      this.studentForm = this.$utils.deepCopy(data);
    },
    handleDelete(index) {
      this.$confirm("确定删除该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.rows.splice(index, 1);
          this.$refs['studentForm'].resetFields();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
};
</script>

<style  lang="scss" scoped>
@import "@/styles/table.scss";
// table thead tr th {
//   text-align: center;
// }
// .bor {
//   border: 2px solid black;
// }
// table {
//   *border-collapse: collapse;
//   border-spacing: 0;
//   width: 700px;
//   color: #2b2b2b;
// }
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
</style>      

