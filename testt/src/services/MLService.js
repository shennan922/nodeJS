import rep from './index'

export default {
  async getMLList () {
    const response = await rep.request.get('/ml/getList')
    return response.data
  }
}

