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
          <div>
            <el-button class="NewButton" type="primary" icon="el-icon-plus" @click="handleAdd">Create a New Paper</el-button>
            <el-button  class="NewButton" type="primary" icon="el-icon-plus">Upload Content</el-button>
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
            ref="ContenTable"
            >
            <el-table-column min-width="12%" prop="ContentID" label="ContentID" sortable></el-table-column>
            <el-table-column min-width="12%" prop="SearchTerm" label="SearchTerm" ></el-table-column>
            <el-table-column min-width="18%" prop="ContentCategory" label="Category">
              <template slot-scope="scope" >
                <el-tag
                  :key="tag"
                  v-for="tag in getCategoryDesc(scope.row.ContentCategory)"
                  :closable="false"
                  effect="light"
                  style="width:100px;background-color:white;border-color:white;color:black;"
                  >
                  {{tag}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column min-width="10%" prop="ShortTitle" label="ShortTitle"></el-table-column>
            <!-- <el-table-column min-width="5%" prop="ContentMessage" label="ContentMessage"></el-table-column> -->
            <el-table-column min-width="10%" prop="SEID" label="SEID" sortable></el-table-column>
            <el-table-column min-width="15%" prop="CreateDt" label="CreateDate">
              <template scope="scope">
                {{dateFormat(scope.row.CreateDt)}}
              </template>
            </el-table-column>
            <el-table-column min-width="15%" prop="ModifyDt" label="ModifyDate">
              <template scope="scope">
                {{dateFormat(scope.row.ModifyDt)}}
              </template>
            </el-table-column>
            <el-table-column min-width="15%" label="Operation">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" right-padding="20px" class="buttonEdit" @click="handleEdit(scope.row)" plain><i class="el-icon-edit"></i>Edit</el-button>
                <el-button size="mini" type="info" @click="handleDelete(scope.row.ContentID)" plain class="buttonDelete"><i class="el-icon-delete"></i>Delete</el-button>
                <!-- <el-button size="mini" type="info" @click="handleID(scope.row.SEID)" plain >Test</el-button> -->
              </template>
            </el-table-column>
          </el-table> 

          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page=pageNum
              :page-sizes="[1, 5, 10]"
              :page-size=pageSize
              layout="total, sizes, prev, pager, next, jumper"
              :total= "getList.length">
            </el-pagination>
          </div>
        
        </el-col>
      </el-row>
      <!--增加Content页面-->
      <el-dialog :title ="formStatus==1?'Create a New Paper':'Update a Paper'" :lock-scroll="true" :visible.sync="dialogCreateVisible" v-if="dialogCreateVisible" class="dialogContent" @close="handleFormClose" :close-on-click-modal="false" :modal-append-to-body="false">
        <div style="height:50vh;">
          <el-scrollbar style="height:100%">
            <el-form 
            ref="AddContentForm"
            :model="AddContentForm" 
            :rules="formStatus!=0?addContentFormRules:null"    
            label-width="130px"
            >
            <!-- :rules="addContentFormRules" -->
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
                    <el-select v-model="AddContentForm.ContentCategory"  placeholder="请选择" style="width:87%;padding-left:0px" ref="categorySelect">
                      <el-option
                        v-for="item in getCategoryList" :key="item.CategoryID" :label="item.CategoryDesc" :value="item.CategoryID">
                      </el-option> 
                      </el-select> 
                      <el-button  class="button-new-tag" size="small" @click="showInput">+</el-button>
                    </div>
                    <div style="margin-top:5px">
                      <el-tag
                      :key="tag"
                      v-for="tag in dynamicTags"
                      :closable="true"
                      
                      @close="onTagClose(tag)"
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
                  <el-form-item label="Upload Photo" prop="UpdatePhotoData">
                    <el-row>
                      <el-col :span="5">
                        <el-upload
                            class="avatar-uploader"
                            action="/api/myContent/imageUpload"
                            :show-file-list="false"
                            :on-change="handleChange"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :data="{ContentID}"
                            ref="uploadImg"
                            >
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item label="Upload PDF">
                    <el-row>
                      <el-col :span="12">
                        <el-upload
                          ref="upload"
                          action="/api/myContent/uploadPdf"
                          :multiple="true"
                          :show-file-list="true"
                          :file-list="fileList"
                          accept=".PDF,.pdf"                    
                          :data="uploadData"
                          :auto-upload="true"
                          :on-change="uploadOnChange"
                          :on-remove="uploadOnRemove"
                          :on-preview="uploadOnPreview"
                          >
                          <el-button slot="trigger">Choose file</el-button>
                        </el-upload>
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
          </el-scrollbar>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="createSubmit" v-if="formStatus==1"  type="primary">Submit</el-button>
          <el-button @click.native="updateSubmit" v-if="formStatus!=1"  type="primary">Submit</el-button>
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
// import MyContentService from "../../services/MyContentService";
import ContentService from "../../services/ContentService";
import router from '../../router'

export default {
  mounted() {
    this.getDetailList();
    this.getCategoryListData();
    this.getSEList();
    
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
      formStatus:0, 
      getSEListAll:[],
      getCategoryList:[],
      dialogCreateVisible: false,
      dynamicTags:[],
      dynamicTagIDs:[],
      value:'',
      imageUrl: '',
      ContentForm:{
        ContentID:"",
        SearchTerm:"",
        ContentCategory:"",
        ShortTitle:"",
        ContentMessage:"",
        SEID:"",
        CreateDT:"",
        ModifyDT:"",
        UpdatePhotoData:"",
        UpdatePhotoName:"",
        UpdatePhotoPath:"",
      },
      AddContentForm: {
        ContentID:"",
        SEID:"",
        ContentCategory:"",
        ShortTitle: "",
        SearchTerm: "",
        Content: "",
      },
      UploadFiles: [],
      uploadData:{
        ContentID:"",
        UploadTime: "",
      },
      fileList:[],
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
    handleID(){
      var fmRoutes 
      var route ={
        // path: '/contentForms/3456',
        // name: 'test1111',
        // meta: { auth: true, title: 'test1111' },
        // component: () => import('../views/contentForms/Log111.vue')
      }      
      router.push(route)
    },
    getID(){
      this.ContentID = Number(Math.random().toString().substr(3,6) );
    },
    uploadOnRemove(file){
      console.log(file)
      ContentService.deleteFile({ContentID:this.ContentID,filePath:file.name})
    },
    uploadOnPreview(file){
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = file.url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
    },    
    uploadOnChange(file){   
      this.getCurrentTime()      
      this.uploadData.ContentID = this.ContentID
      this.uploadData.UploadTime = this.currentTime
      this.fileList.push({"name":file.name,"url":'/api/myContent/downloadpdf?ContentID='+this.ContentID+'&file='+file.name})
    },    
    onTagClose(tag){
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag),1)
      this.dynamicTagIDs.splice(this.dynamicTags.indexOf(tag),1)
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
    handleFormClose(){          
      //resetFields将form重置到mounted之后的状态, 对于编辑页面不适用
      //this.$refs.AddSEForm.resetFields()
      this.AddContentForm = {
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
      }
      this.formStatus = 0 
      this.changeFlag = false
      this.dynamicTags = []
      this.dynamicTagIDs = []
      this.UploadFiles = []
      this.fileList = []
      this.imageUrl = ''
    },

    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      var name =this.getCategoryList.find((item)=>{//这里的selectList就是上面遍历的数据源
          return item.CategoryID === this.$refs.categorySelect.value;//筛选出匹配数据
      }).CategoryDesc

      if(this.dynamicTags.find(tag=>{return tag === name})){
        this.$message.error('请勿重复添加');
      }else{
        this.dynamicTags.push(name)
        this.dynamicTagIDs.push(this.$refs.categorySelect.value)
      }      
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
          //console.log(this.fileList)
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
      this.dynamicTags = []
      this.dynamicTagIDs = []
      this.ContentID = row.ContentID
      this.getFileListData({ContentID:row.ContentID})
      var id = row.ContentCategory
      var idx = id.split(",")
      idx.forEach(id => {
        for(var item of this.getCategoryList){
          if(id==item.CategoryID){
            this.dynamicTags.push(item.CategoryDesc)
            this.dynamicTagIDs.push(item.CategoryID)
          }
        }
      })
      this.formStatus = 2;
      this.dialogCreateVisible = true;
      this.defaultMsg =row.ContentMessage;
      this.imageUrl = row.PhotoPath;
      
      this.AddContentForm = {
        ContentID:row.ContentID,
        SEID:row.SEID,
        ContentCategory:row.ContentCategory,
        ShortTitle: row.ShortTitle,
        SearchTerm: row.SearchTerm,
        ContentMessage: row.ContentMessage,
        CreateDt:row.CreateDt,
          ModifyDt:row.ModifyDT,
          PhotoName:row.UpdatePhotoName,
          PhotoPath:row.UpdatePhotoData,
      };
      
    },
    handleDelete(ContentID){
      ContentService.myContentDelete({ContentID:ContentID}).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        //this.dialogCreateVisible = false;
        this.getDetailList();
        // this.reload();
      }).catch((error) => {
        this.$message({
          type: 'info',
          message: '删除失败'+error
        });
      })
    },
    changeTableSort(column){
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
        this.getSearchInfo = this.getSearchInfo.sort((a, b) => //b[fieldName] - a[fieldName]
          b[fieldName].localeCompare(a[fieldName])
        );
      }
      //按照升序排序
      else{
        this.getSearchInfo = this.getSearchInfo.sort((a, b) => //a[fieldName] - b[fieldName]
          a[fieldName].localeCompare(b[fieldName])
        );
      }

      //如果字段名称为“创建时间”，将时间戳格式的“创建时间”再转换为时间格式
      if(fieldName=="createTime"){
        this.getSearchInfo.map(item => {
          item.createTime = this.$moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      }   
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return "color:#0c0c0c;font-wight:100;font-size:15px;text-align:left";
    },
    handleAdd() {
      this.imageUrl = '';
      this.getID();
      this.dynamicTags =[];
      this.dynamicTags = [];
      this.formStatus = 1
      this.dialogCreateVisible = true;
      this.defaultMsg ="";
      this.AddContentForm = {
        SEID:"",
        ContentCategory:"",
        ShortTitle: "",
        SearchTerm: "",
        ContentMessage: "",
        UpdatePhoto: null,
        UpdatePhotoName:'',
        UpdatePhotoData:''
      };
    },
    beforeUpload(UpdatePDF) {

      // this.fileSize = file.size;
      const extension = UpdatePDF.name.split(".").slice(-1) == "pdf";
      if (!extension) {
        this.$message.warning("上传模板只能是pdf格式!");
        return;
      }
      
      let reader = new FileReader();
      reader.readAsDataURL(UpdatePDF);
      reader.onload = function () {
        this.fileBody = reader.result
      }
      console.log(this.fileBody)
      return false; // 返回false不会自动上传
    },
    handleChange(res, file) {
      //this.file = file.slice(-1);
    },
    handleAvatarSuccess(res,file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      //上传成功之后清除历史记录  
      this.$refs.uploadImg.clearFiles();  
      //this.AddContentForm.UpdatePhotoPath = this.imageUrl;
    },
    beforeAvatarUpload(UpdatePhoto) {
      const isJPG = UpdatePhoto.type === 'image/jpeg';
      const isLt2M = UpdatePhoto.size / 1024 / 1024 < 0.2;
      if(!isJPG || !isLt2M)
      {
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 200KB!');
        }
        return isJPG && isLt2M;
      }
      else
      {
        this.AddContentForm.UpdatePhoto = UpdatePhoto;
        this.AddContentForm.UpdatePhotoName = UpdatePhoto.name;
        
        const reader = new FileReader();
        reader.readAsDataURL(UpdatePhoto);
        const that = this;
        reader.onload = function () {
          that.AddContentForm.UpdatePhotoData = reader.result;
        };
      }
    },
    // httpRequest(data) {
    //   const reader = new FileReader();
    //     let _this = this  // 这里要转一下是因为在下面的function里 this的指向发生了变化
    //     let rd = new FileReader()
    //     let file = data.file
    //     rd.readAsDataURL(file)
    //     rd.onloadend = function(e) {
    //       _this.AddContentForm.UpdatePhotoData = this.result
    //       console.log(_this.AddContentForm.UpdatePhotoData,88888888);
    //     }
    //     this.imageUrl = this.result;
    //     this.handleAvatarSuccess(data);

    // },

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
    async createSubmit(formStatus) {
      //获取富文本框内容
      this.AddContentForm.ContentMessage = this.$refs.ue.getUEContent(); // 调用子组件方法
      //获取当前系统时间
      this.getCurrentTime();
        this.$refs.AddContentForm.validate((valid) => {
           if (valid) {
              this.$confirm('确认提交？', '提示', {}).then(async() => {
              await ContentService.myContentCreate(
                {
                  ContentID: this.ContentID,
                  SEID: this.AddContentForm.SEID,
                  SearchTerm: this.AddContentForm.SearchTerm,
                  ContentCategory: this.dynamicTagIDs.toString(),
                  ShortTitle: this.AddContentForm.ShortTitle,
                  ContentMessage: this.AddContentForm.ContentMessage,
                  TimeStamp: this.currentTime,
                  PhotoName:this.AddContentForm.UpdatePhotoName,
                  PhotoPath:this.AddContentForm.UpdatePhotoData,
                },
            /*
              await ContentService.ContentCreate({
                file:this.UploadFiles
              }),
              
              await ContentService.myContentPhotoUpload({
                contentId: "1",
                fileId: "1",
                fileName: this.AddContentForm.UpdatePhotoName,
                file: this.AddContentForm.UpdatePhotoData,
              })
              */
              ).then((res) => {              
                if (res.code == 200){
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  });
                  this.dialogCreateVisible = false;
                  this.getDetailList()
                  this.handleFormClose()
                }    
                if (res.code == 400){
                  this.$message({
                    type: 'info',
                    message: res.message
                  });
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
    async updateSubmit() {
      //获取富文本框内容
      this.AddContentForm.ContentMessage = this.$refs.ue.getUEContent();
      //获取当前系统时间
      this.getCurrentTime();
      this.$refs.AddContentForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交？', '提示', {}).then(async() => { 
            await ContentService.myContentUpdate(
              {
                  ContentID:this.AddContentForm.ContentID,
                  SEID: this.AddContentForm.SEID,
                  SearchTerm: this.AddContentForm.SearchTerm,
                  ContentCategory: this.dynamicTagIDs.toString(),
                  ShortTitle: this.AddContentForm.ShortTitle,
                  ContentMessage: this.AddContentForm.ContentMessage,
                  TimeStamp: this.currentTime,
                  PhotoName:this.AddContentForm.UpdatePhotoName,
                  PhotoPath:this.AddContentForm.UpdatePhotoData,
              },
              // await ContentService.myContentPhotoUpload({
              //   contentId: "1",
              //   fileId: "1",
              //   fileName: this.AddContentForm.UpdatePhotoName,
              //   file: this.AddContentForm.UpdatePhotoData,
              // })
            ).then((res) => {
              // if (res.code == 400){
              //   this.$message({
              //     type: 'info',
              //     message: res.message
              //   });
              // } 
              if (res.code == 200){
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.dialogCreateVisible = false;
                this.getDetailList();
                this.handleFormClose()
              }                
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消新增'
            });
          })
        }
      })
    },
    dateFormat(time) {
      if(time == null)
      {
        return "";
      }
      else{

        var date=new Date(time);
        var year=date.getFullYear();
        
        /* 在日期格式中，月份是从0开始的，因此要加0
          * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
          * */
        var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
        // 拼接
        //return year+"-"+month+"-"+day+" "+hours+":"+minutes;
        return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds
      }
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
  //padding-left:5px;
  min-width:250px;
  margin-left: -10px;
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
  width:120%;
  margin-left:-10%;
  .el-dialog__header{
    text-align: left;
    padding-left:7%;
    background-color: #498CDF,
  };
  .el-dialog__title{
    color:#fff;
    margin-left:-5%;
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
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 110px;
    height: 110px;
    line-height: 110px;
    text-align: center;
  }
  .avatar {
    width: 110px;
    height: 110px;
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
  .el-form-item__label {
    text-align: left; 
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
}
}
.el-tag {
  margin-right: 10px;
  width: 120px;

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
  padding-left:4%;
}
.dialog-footer{
  margin-right:2.3%;
  //margin-top:-10%;
}
.el-form-item{
  margin-bottom:17px;
}

</style>