import req from './index'

export default {
  async getGeoTree (data) {
    const response = await req.request.get('/general/getGeoTree?Level='+data.Level+'&NodeDesc='+data.NodeDesc)
    return response.data
  },
  async getHospital (data) {
    const response = await req.request.get('/general/getHospital?City='+data.City)
    return response.data
  },
  async getTeam () {
    const response = await req.request.get('/general/getTeam')
    return response.data
  }
}

