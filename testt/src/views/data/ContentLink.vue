<template>
  <div class='main'>  
    <el-form 
    ref="AddContentForm"
    :model="AddContentForm" 
    label-width="130px"
    >
      <el-row>
        <el-col :span="24" class="el-col_Content">
          <el-form-item label="SE" prop="SEID">
            <el-select v-model="AddContentForm.SEID" clearable placeholder="请选择" style="width:100%;padding-left:0px">
              <el-option
                v-for="item in getSEListAll" :key="item.SEID" :label="item.SEName" :value="item.SEID">
              </el-option>
            </el-select> 
          </el-form-item>
        <el-form-item label="Content Category" prop="ContentCategory">
            <div>          
              <el-tag
                :key="tag"
                v-for="tag in getCategoryDesc(AddContentForm.ContentCategory)"
                :closable="false"
                effect="light"
                style="width:100px;"
                >
                {{tag}}
              </el-tag>
            </div>            
          </el-form-item>
          <el-form-item label="Short Title" prop="ShortTitle">
            <el-input v-model="AddContentForm.ShortTitle" ></el-input>
          </el-form-item>
          <el-form-item label="Search Term" prop="SearchTerm" >
            <el-input v-model="AddContentForm.SearchTerm"></el-input>
          </el-form-item>           

          <el-form-item label="Upload PDF">
            <el-row>
              <el-col :span="5">
                <p :key="file.url" v-for="file in fileList">
                <el-link   :href="file.url"  >
                    {{file.name}}
                </el-link>
                </p>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="Content"  prop="ContentMessage">
            <div>
              <UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue"></UE>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>            

  </div>
</template>

<script src="Content/jquery-1.9.1.min.js"></script>
<script src="Content/vue/dist/vue.js"></script>

<script>
import SEService from "../../services/SEService";
import UE from '../../components/ue/ue.vue';
import ContentService from "../../services/ContentService";
import router from '../../router'

export default {
  mounted() {
    this.getContent(this.$route.query.id);
    this.getCategoryListData();
    this.getSEList();    
    this.getFileListData({ContentID:this.$route.query.id})
  },  
  components: {UE},
  data(){
    return {
      ContentID:"",
      pageNum:1,//table第几页
      pageSize:5,  
      defaultMsg:"",
      currentTime:"",
      config: {
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 初始容器高度
        initialFrameHeight: 300,
        // 工具栏是否可以浮动
        autoFloatEnabled: false,
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        //UEDITOR_HOME_URL: '/static/UE/',
        //serverUrl: "https://operationgwdev.bgycc.com/zuul/phantom-service-storage/ueditor/exec", //图片上传的地址
        //serverUrl:"http://localhost:8080/data/MyContent"
        //serverUrl:'/api/ueditor/ueditor/ue'
      },
      
      ue1: "ue1", // 不同编辑器必须不同的id
      ue2: "ue2",
      getSEListAll:[],
      getCategoryList:[],
      dynamicTags:[],
      dynamicTagIDs:[],
      
      AddContentForm : {
        SEID:"",
        ContentCategory:"",
        ShortTitle: "",
        SearchTerm: "",
        UpdatePDF: null,
        UpdatePDFName: '',
        UpdatePDFData:'',
        ContentMessage: "",
        UpdatePhoto: null,
        UpdatePhotoName:'',
        UpdatePhotoData:'',
        UpdatePhotoPath:'',
      },
      
      fileList:[],
      
     

      
    };
  },
  methods: {
    
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
    
    
    getCategoryDesc(id){
      let idx = id.split(",")
      let desc = []
      idx.forEach(id => {
        for(var item of this.getCategoryList){
          if(id==item.CategoryID){
            desc.push(item.CategoryDesc)
          }
        }
      })
      return desc
    },
    

    
    
    
    getCategoryListData() {
      ContentService.getCategoryList()
        .then((res) => {
          this.getCategoryList = res.data;
            //console.log("-=====-"+JSON.stringify(this.getCategoryList))
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    getFileListData(data) {
      ContentService.getFileList(data)
        .then((res) => {
          res.data.forEach(file => {       
            //var content = ContentService.downloadFile({ContentID:data.ContentID,filePath:file.FileName})  
            this.fileList.push({"name":file.FileName,"url":'/api/myContent/downloadpdf?ContentID='+data.ContentID+'&file='+file.FileName})
          });
          console.log(this.fileList)
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    getContent(id) {
       ContentService.getContentByPk(id)
        .then((res) => {
          this.AddContentForm = res.data;
          this.defaultMsg = res.data.ContentMessage          
        })
        .catch(function (err) {
          console.log("err"+err);
        });
    },
    
    
    
    
    
    
   

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
    
    
    dateFormat(time) {
      var date=new Date(time);
      var year=date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
        * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
        * */
      var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
      var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
      var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours()-8;
      var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
      var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
      // 拼接
      //return year+"-"+month+"-"+day+" "+hours+":"+minutes;
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds
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
  //height: 80px;
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
  padding-left:5px;
  }

.Button{
    float: right;
    
    text-align: right;
    color: white;
    margin-right:1%;
    font-weight:bold;
}
.searchBox{
  width: 13.8%;
  float: right;
  padding: 5px;
  /deep/.el-input--prefix .el-input__inner {
    padding-left: 10px; 
  }
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
  padding-left:15px;
  background-color:#639eda;
  color:#fff;
  margin-left:10px;
  }
  .el-dialog__footer{
    padding-top:0px;
  }
  .el-dialog__body{
    padding: 3% 3% 0px 5%;
  }  
  .fileUpload .el-upload-list {
    width: 178px;

  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
    height: 100%;
  }
  .el-scrollbar__thumb {
    overflow-x: hidden;
    height: 0%;
  }
}
.el-tag {
  margin-right: 10px;
  width: 120px;
  float:left;
  } 
.buttonEdit{
  margin-right:3%;
  width:75px;
  margin-top:3px;
}
.buttonDelete{
  //margin-right:3%;
  width:75px;
  margin-top:3px;
  //padding-left:3%;
  margin-left:0px;
}
.NewButton{
    background-color:#639eda;
    //text-align: right;
    //color: white;
    //float: right;
    //margin-top: -10px;
    //margin-right:1%;
    font-weight:bold;
    border-color:#639eda ;
}
.el-col_Content{
  //margin-right:10px;
  padding-right:2%;
}
.dialog-footer{
  margin-right:2.3%;
}
</style>