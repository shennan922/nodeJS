import req from './index'


export default {
  async getContentByPk (id){
    const response = await req.request.get('/MyContent/getContentByPk?id='+id)
    return response.data
  },
  async getList () {
    const response = await req.request.get('/MyContent/getList')
    return response.data
  },
  async getFileList (data) {
    const response = await req.request.get('/MyContent/getFileList?ContentID='+data.ContentID)
    return response.data
  },
  async getCategoryList () {
    const response = await req.request.get('/MyContent/getCategory')
    return response.data
  },
  async myContentCreate (data) {
    const response = await req.request.post('/myContent/create',data)
    return response.data

  },
 async myContentDelete (data) {
    const response = await req.request.get('/myContent/delete?ContentID='+data.ContentID)
    return response.data
  },  
  async myContentUpdate (data) {
    const response = await req.request.post('/myContent/update',data)
    return response.data
  },
  async ContentCreate (data) {
    // let requestConfig = {
    //   headers: {
    //   'Content-Type': 'multipart/form-data'
    //   },
    //  }
    const response = await req.request.post('/myContent/createPdf',data)
    return response.data
  },
  async myContentPhotoUpload (data) {
    const response = await req.request.post('/myContent/photoUpload',data)
    return response.data
  }
  ,
  async downloadFile (data) {
    const resData = await req.request.get('/myContent/downloadpdf?ContentID='+data.ContentID+'&file='+data.filePath,{responseType: 'blob'});
    //console.log(resData.data)
    return resData.data
    /*
    if (resData) {
      var blob = new Blob([resData.data], { type: "application/pdf" })
      //var blob = new Blob(["\uFEFF1,2,3,4,5,6"], { type: "text/csv" });
      console.log(blob)
      //const fileName = 'xxx.pdf'//this.weatherTitleInfo.replace(/-/g,"").replace(" ","_") + ".pdf";
      let url = window.URL.createObjectURL(blob);
      console.log(url)

      //let link = document.createElement('a');
      //link.style.display = 'none';
      //link.href = url;
      //link.setAttribute('download', fileName);
      //document.body.appendChild(link);
      //link.click();

      window.open(url)
    } else {
      this.$message.warning('下载失败')
    }
    */  
  },
  async deleteFile (data) {
    const response = await req.request.get('/myContent/deleteFile?file='+data.filePath+'&'+'ContentID='+data.ContentID);
    return response.data
  },
  async downloadImg (data) {
    const resData = await req.request.get('/myContent/downloadImg?ContentID='+data.ContentID,{responseType: 'blob'});
    console.log(resData.data)

    if (resData) {
      var blob = new Blob([resData.data], { type: "image/jpeg"})
      //var blob = new Blob(["\uFEFF1,2,3,4,5,6"], { type: "text/csv" });
      console.log(blob)
      const fileName = 'xxx.jpg'//this.weatherTitleInfo.replace(/-/g,"").replace(" ","_") + ".pdf";
      let url = window.URL.createObjectURL(blob);

      
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      //window.open(url)
    } else {
        this.$message.warning('下载失败');
    }
    
  }
}

