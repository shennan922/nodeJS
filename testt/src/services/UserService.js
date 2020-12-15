import request from './index'

export default {
  async getUserById () {
    const response = await request.get('/user/:id')
    return response.data
  },
  async register (data) {
    return await request.post(
      '/user/',
      data
    )
  },
  async login (data) {
    const response = await request.post(
      '/user/login',
      data
    )
    return response
  }
}
