import req from './index'

export default {
  async getLog (data) {
    const response = await req.request.get('/general/getLog?fileName='+data.fileName)
    return response.data
  },
  async getFileList () {
    const response = await req.request.get('/general/getLogList')
    return response.data
  }
}

