import req from './index'

export default {
  async getList () {
    const response = await req.request.get('/MyContent/getList')
    return response.data
  },
  async getCategoryList () {
    const response = await req.request.get('/MyContent/getCategory')
    return response.data
  }
 
}

