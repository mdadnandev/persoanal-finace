import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { transactionService, categoryService, dashboardService } from '../services/financeService'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const FinanceContext = createContext(null)

export const FinanceProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()

  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [pagination, setPagination] = useState({ page: 0, size: 20, totalElements: 0, totalPages: 0 })
  const [filters, setFilters] = useState({ type: '', categoryId: '', startDate: '', endDate: '' })
  const [loading, setLoading] = useState({ transactions: false, categories: false, dashboard: false })
  const [error, setError] = useState(null)

  // Load categories and dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories()
      fetchDashboard()
    }
  }, [isAuthenticated])

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(prev => ({ ...prev, transactions: true }))
    setError(null)
    try {
      const cleanParams = {}
      if (params.type) cleanParams.type = params.type
      if (params.categoryId) cleanParams.categoryId = params.categoryId
      if (params.startDate) cleanParams.startDate = params.startDate
      if (params.endDate) cleanParams.endDate = params.endDate
      cleanParams.page = params.page ?? 0
      cleanParams.size = params.size ?? 20

      const data = await transactionService.getAll(cleanParams)
      setTransactions(data.content || [])
      setPagination({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
      })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load transactions'
      setError(msg)
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }))
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    setLoading(prev => ({ ...prev, categories: true }))
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
      console.error('Failed to load categories:', err)
    } finally {
      setLoading(prev => ({ ...prev, categories: false }))
    }
  }, [])

  const fetchDashboard = useCallback(async (year) => {
    setLoading(prev => ({ ...prev, dashboard: true }))
    try {
      const data = await dashboardService.getDashboard(year)
      setDashboard(data)
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }))
    }
  }, [])

  const createTransaction = useCallback(async (data) => {
    const newTx = await transactionService.create(data)
    setTransactions(prev => [newTx, ...prev])
    await fetchDashboard()
    toast.success('Transaction added successfully! 💰')
    return newTx
  }, [fetchDashboard])

  const updateTransaction = useCallback(async (id, data) => {
    const updated = await transactionService.update(id, data)
    setTransactions(prev => prev.map(t => t.id === id ? updated : t))
    await fetchDashboard()
    toast.success('Transaction updated! ✅')
    return updated
  }, [fetchDashboard])

  const deleteTransaction = useCallback(async (id) => {
    await transactionService.delete(id)
    setTransactions(prev => prev.filter(t => t.id !== id))
    await fetchDashboard()
    toast.success('Transaction deleted')
  }, [fetchDashboard])

  const createCategory = useCallback(async (data) => {
    const newCat = await categoryService.create(data)
    setCategories(prev => [...prev, newCat])
    toast.success('Category created!')
    return newCat
  }, [])

  const deleteCategory = useCallback(async (id) => {
    await categoryService.delete(id)
    setCategories(prev => prev.filter(c => c.id !== id))
    toast.success('Category deleted')
  }, [])

  const exportCsv = useCallback(async (params = {}) => {
    await transactionService.exportCsv(params)
    toast.success('CSV exported successfully! 📊')
  }, [])

  return (
    <FinanceContext.Provider value={{
      transactions, categories, dashboard, pagination, filters, loading, error,
      setFilters, fetchTransactions, fetchCategories, fetchDashboard,
      createTransaction, updateTransaction, deleteTransaction,
      createCategory, deleteCategory, exportCsv,
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) throw new Error('useFinance must be used within FinanceProvider')
  return context
}
