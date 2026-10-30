import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency, formatDate } from '../utils/formatters'
import { Plus, Trash2, Edit, Filter, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import TransactionModal from '../components/transactions/TransactionModal'
import EmptyState from '../components/common/EmptyState'
import { useEffect } from 'react'

const TransactionsPage = () => {
  const {
    transactions, categories, pagination, filters, loading,
    fetchTransactions, deleteTransaction, setFilters, exportCsv
  } = useFinance()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editTransaction, setEditTransaction] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState({ type: '', categoryId: '', startDate: '', endDate: '' })
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchTransactions({ page: 0, size: 20 })
  }, [])

  const applyFilters = () => {
    setFilters(localFilters)
    fetchTransactions({ ...localFilters, page: 0 })
    setShowFilters(false)
  }

  const clearFilters = () => {
    const empty = { type: '', categoryId: '', startDate: '', endDate: '' }
    setLocalFilters(empty)
    setFilters(empty)
    fetchTransactions({ page: 0 })
  }

  const handlePageChange = (newPage) => {
    fetchTransactions({ ...filters, page: newPage })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return
    setDeletingId(id)
    try {
      await deleteTransaction(id)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (tx) => {
    setEditTransaction(tx)
    setShowAddModal(true)
  }

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{pagination.totalElements} total transactions</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => exportCsv(filters)}
            className="btn-secondary text-sm py-2 px-3"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => setShowFilters(p => !p)}
            className={`btn-secondary text-sm py-2 px-3 relative ${activeFiltersCount > 0 ? 'border-primary-500/50 text-primary-400' : ''}`}
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filter</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setEditTransaction(null); setShowAddModal(true) }}
            className="btn-primary text-sm"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="glass-card p-4 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="form-label text-xs">Type</label>
              <select
                className="form-input text-sm py-2"
                value={localFilters.type}
                onChange={e => setLocalFilters(p => ({ ...p, type: e.target.value }))}
              >
                <option value="">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Category</label>
              <select
                className="form-input text-sm py-2"
                value={localFilters.categoryId}
                onChange={e => setLocalFilters(p => ({ ...p, categoryId: e.target.value }))}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">From Date</label>
              <input type="date" className="form-input text-sm py-2"
                value={localFilters.startDate}
                onChange={e => setLocalFilters(p => ({ ...p, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label text-xs">To Date</label>
              <input type="date" className="form-input text-sm py-2"
                value={localFilters.endDate}
                onChange={e => setLocalFilters(p => ({ ...p, endDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={applyFilters} className="btn-primary text-sm py-2">Apply</button>
            <button onClick={clearFilters} className="btn-secondary text-sm py-2">Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading.transactions ? (
          <div className="p-8 flex justify-center">
            <div className="spinner w-8 h-8" />
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            type="transactions"
            onAction={() => setShowAddModal(true)}
            actionLabel="Add Transaction"
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-800/30">
                    <th className="table-header text-left">Date</th>
                    <th className="table-header text-left">Description</th>
                    <th className="table-header text-left">Category</th>
                    <th className="table-header text-left">Type</th>
                    <th className="table-header text-right">Amount</th>
                    <th className="table-header text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id} className="table-row">
                      <td className="table-cell text-slate-400 whitespace-nowrap">{formatDate(tx.date)}</td>
                      <td className="table-cell">
                        <p className="text-slate-200 font-medium truncate max-w-xs">
                          {tx.description || tx.category?.name || 'Transaction'}
                        </p>
                        {tx.notes && <p className="text-xs text-slate-500 truncate max-w-xs">{tx.notes}</p>}
                      </td>
                      <td className="table-cell">
                        {tx.category ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{ background: `${tx.category.color}20`, color: tx.category.color }}>
                            {tx.category.icon} {tx.category.name}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">Uncategorized</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className={tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}>
                          {tx.type === 'INCOME' ? '↑' : '↓'} {tx.type}
                        </span>
                      </td>
                      <td className={`table-cell text-right font-semibold ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td className="table-cell text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(tx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            disabled={deletingId === tx.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            {deletingId === tx.id ? <div className="spinner w-3.5 h-3.5" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-700/50">
              {transactions.map(tx => (
                <div key={tx.id} className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${tx.category?.color || '#6366f1'}20` }}>
                    {tx.category?.icon || '💳'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {tx.description || tx.category?.name || 'Transaction'}
                        </p>
                        <p className="text-xs text-slate-500">{formatDate(tx.date)} · {tx.category?.name || 'Uncategorized'}</p>
                      </div>
                      <span className={`text-sm font-bold ml-2 ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(tx)} className="p-1.5 text-slate-500 hover:text-primary-400"><Edit size={13} /></button>
                    <button onClick={() => handleDelete(tx.id)} className="p-1.5 text-slate-500 hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
                <p className="text-sm text-slate-500">
                  Page {pagination.page + 1} of {pagination.totalPages}
                  <span className="hidden sm:inline"> · {pagination.totalElements} total</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.first}
                    className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.last}
                    className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <TransactionModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditTransaction(null) }}
        transaction={editTransaction}
      />
    </div>
  )
}

export default TransactionsPage
