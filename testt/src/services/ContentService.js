import req from './index'


export default {
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
  }
  ,
  async downloadFile (data) {
    // let requestConfig = {
    //   headers: {
    //   'Content-Type': 'multipart/form-data'
    //   },
    //  }
    //var file = await req.request.get('/myContent/downloadpdf?file=./contents/3333.pdf',data)
    //console.log(file.data)

  
    //let parms = {
     // FILE_INFO: this.weatherTitleInfo
 // }
  //const self = this;

  const resData = await req.request.get('/myContent/downloadpdf?file='+data.filePath,{responseType: 'blob'});
  console.log(resData.headers)

  if (resData) {
      var blob = new Blob([resData.data], { type: "application/pdf" })
      //var blob = new Blob(["\uFEFF1,2,3,4,5,6"], { type: "text/csv" });
      console.log(blob)
      const fileName = 'xxx.pdf'//this.weatherTitleInfo.replace(/-/g,"").replace(" ","_") + ".pdf";
      let url = window.URL.createObjectURL(blob);
      console.log(url)
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
  } else {
      this.$message.warning('下载失败');
  }
  
  }
}

