import req from './index'

export default {
  async getList () {
    const response = await req.request.get('/MyContent/getList')
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
  async ContentCreate (data) {
    // let requestConfig = {
    //   headers: {
    //   'Content-Type': 'multipart/form-data'
    //   },
    //  }
    const response = await req.request.post('/myContent/createPdf',data)
    return response.data
  }
}

