import api from './api'

export const transactionService = {
  getAll: async (params = {}) => {
    const response = await api.get('/transactions', { params })
    return response.data.data
  },

  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`)
    return response.data.data
  },

  create: async (data) => {
    const response = await api.post('/transactions', data)
    return response.data.data
  },

  update: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data)
    return response.data.data
  },

  delete: async (id) => {
    await api.delete(`/transactions/${id}`)
  },

  exportCsv: async (params = {}) => {
    const response = await api.get('/transactions/export/csv', {
      params,
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `transactions_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories')
    return response.data.data
  },

  create: async (data) => {
    const response = await api.post('/categories', data)
    return response.data.data
  },

  delete: async (id) => {
    await api.delete(`/categories/${id}`)
  },
}

export const dashboardService = {
  getDashboard: async (year) => {
    const params = year ? { year } : {}
    const response = await api.get('/dashboard', { params })
    return response.data.data
  },
}
