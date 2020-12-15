import request from './index'

export default {
  async getSEList (data) {
    const response = await request.get('/se/getList?Name='+data.Name)
    return response.data
  },
  async SECreate (data) {
    const response = await request.post('/se/create',data)
    return response.data
  },
  async SEUpdate (data) {
    const response = await request.get('/se/update',data)
    return response.data
  },
  async SEDelete (data) {
    const response = await request.get('/se/delete?SEID='+data.SEID)
    return response.data
  }
}

