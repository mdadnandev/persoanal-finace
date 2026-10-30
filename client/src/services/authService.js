import api from './api'

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data.data
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data)
    return response.data.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data.data
  },
}
