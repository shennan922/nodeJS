import request from './index'

export default {
  async getMLList () {
    const response = await request.get('/ml/getList')
    return response.data
  }
}

