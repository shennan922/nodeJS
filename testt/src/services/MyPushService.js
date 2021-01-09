import req from './index'

export default {
  async getMyPushList (Name) {
    const response = await req.request.get('/myPush/getList?Name='+Name)
    return response.data
  },
  async myPushCreate (data) {
    const response = await req.request.post('/myPush/create',data)
    return response.data
  }

}

