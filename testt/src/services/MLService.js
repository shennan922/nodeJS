import req from './index'

export default {
  async getMLList () {
    const response = await req.request.get('/ml/getList')
    return response.data
  }
}

