import req from './index'

export default {
  async getSEList (Name) {
    const response = await req.request.get('/se/getList?Name='+Name)
    return response.data
  },
  async SECreate (data) {
    const response = await req.request.post('/se/create',data)
    return response.data
  },
  async SEUpdate (data) {
    const response = await req.request.get('/se/update',data)
    return response.data
  },
  async SEDelete (data) {
    const response = await req.request.get('/se/delete?SEID='+data.SEID)
    return response.data
  },
  async generateQR (key) {
    const response = await req.request.get('http://ec2-3-139-92-146.us-east-2.compute.amazonaws.com/wechat/getqrcode?wechat='+key)
    return response.ticket
  }
}

