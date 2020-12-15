import request from './index'

export default {
  async getLog (data) {
    const response = await request.get('/general/getLog?date='+data.date+'&type='+data.type+'&operation='+data.operation+'&logReadFlag='+data.logReadFlag)
    //const response = await request.get('/general/log/getLog',
    //data
    //)
    return response.data
  }
}

