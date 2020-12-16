import rep from './index'

export default {
  async getSEList (Name) {
    const response = await rep.request.get('/se/getList?Name='+Name)
    return response.data
  },
  async SECreate (data) {
    const response = await rep.request.post('/se/create',data)
    return response.data
  },
  async SEUpdate (data) {
    const response = await rep.request.get('/se/update',data)
    return response.data
  },
  async SEDelete (data) {
    const response = await rep.request.get('/se/delete?SEID='+data.SEID)
    return response.data
  }
}

