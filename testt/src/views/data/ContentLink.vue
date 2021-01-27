<template>
  <div class='main'> 
    <el-form ref="AddContentForm" :model="AddContentForm">
      <el-row>
        <el-col :span="24" class="el-col_Content">
          <div style="border-bottom:1px solid rgb(117, 161, 202)">
            <el-form-item prop="ShortTitle">
                <div style="float:left;padding-left:1%;">          
                  <el-tag class="shortTitle">
                    {{AddContentForm.ShortTitle}}
                  </el-tag>
                </div>           
              </el-form-item>
            </div>
            <!-- <div style="padding-left:2%;padding-right:2%;color:#CCC">
              <hr />
            </div> -->
            <!-- <div style="border:2px solid #CCC;height:0px"></div> -->
          <el-form-item>
            <div class="uEditor">          
              <span v-html="this.defaultMsg"></span>
            </div>            
          </el-form-item>
          <el-form-item>
            <el-row style="margin-top:-2%">
              <el-col :span="14">
                <p></p>
              </el-col>
              <el-col :span="10">
                <el-form-item label="附件">
                  <ul class="pdfStyle" v-for="file in fileList" :key="file.url">
                    <span><a :href="file.url" :download="file.name">{{file.name}}</a></span>
                  </ul>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <div style="padding-left:2%;padding-right:2%;max-width:500px"> 
      <span v-html="this.defaultMsg" style="padding-left:5%;text-align:left;margin-left:5%"></span>
      <ul style="text-align:right" v-for="file in fileList" :key="file.url">
        <span><a :href="file.url">{{file.name}}</a></span>
      </ul>
    </div>-->
  </div>
</template>

<script src="Content/jquery-1.9.1.min.js"></script>
<script src="Content/vue/dist/vue.js"></script>

<script>
import ContentService from "../../services/ContentService";

export default {
  mounted() {
    this.getContent(this.$route.query.id);  
    this.getFileListData({ContentID:this.$route.query.id})
  },  
  components: {UE},
  data(){
    return {
      ContentID:"", 
      defaultMsg:"",  
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
    getFileListData(data) {
      ContentService.getFileList(data)
        .then((res) => {
          res.data.forEach(file => {       
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
  },
  created() {
    document.getElementById("app").style.minWidth = "100px";
  },
  destroyed() {
    document.getElementById("app").style.minWidth = "1024px";
  },
};
</script>

<style  lang="scss" scoped>
.el-col_Content{
  padding-right:2%;
  padding-left:2%;
  .shortTitle{
    background-color:white;
    border-color:white;
    color:black;
    font-size:18px;
    font-weight:bold;
    margin-top:4%;
  }
  .uEditor{
    padding-left:1%;
    padding-right:1%;
    text-align:left;
    /deep/img,p{ 
      max-width:100%;
      height: auto;
    }
  }
  .pdfStyle{
    text-align:left;
    line-height:10px;
  }
}
.el-form-item{
  margin-bottom:5px;
}
</style>
