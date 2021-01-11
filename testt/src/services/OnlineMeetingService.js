import req from './index'

export default {
  async getMeetingList (Name) {
    const response = await req.request.get('/meeting/getList?Name='+Name)
    return response.data
  },
  async MeetingCreate (data) {
    const response = await req.request.post('/meeting/create',data)
    return response.data
  }
}

