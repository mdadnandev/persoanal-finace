import { useState, useEffect } from 'react'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency, formatDate } from '../utils/formatters'
import {
  Plus, Trash2, Edit2, Filter, Download,
  ChevronLeft, ChevronRight, X, ArrowDownRight, ArrowUpRight, Search
} from 'lucide-react'
import TransactionModal from '../components/transactions/TransactionModal'
import EmptyState from '../components/common/EmptyState'

const TransactionsPage = () => {
  const {
    transactions, categories, pagination, filters, loading,
    fetchTransactions, deleteTransaction, setFilters, exportCsv
  } = useFinance()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editTransaction, setEditTransaction] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState({
    type: filters?.type || '',
    categoryId: filters?.categoryId || '',
    startDate: filters?.startDate || '',
    endDate: filters?.endDate || ''
  })
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
    setShowFilters(false)
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

  const activeFiltersCount = Object.values(filters || {}).filter(v => v !== '').length

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#182133]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="page-title">Ledger & Transactions</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#161d2d] border border-[#222c42] text-slate-400">
              {pagination.totalElements || 0} entries
            </span>
          </div>
          <p className="page-subtitle">Granular history of recorded revenues and expenses</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportCsv(filters)}
            className="btn-secondary text-xs py-2 px-3"
            title="Export transactions as CSV"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => setShowFilters(p => !p)}
            className={`btn-secondary text-xs py-2 px-3 relative ${activeFiltersCount > 0 ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5' : ''}`}
          >
            <Filter size={13} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold inline-flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setEditTransaction(null); setShowAddModal(true) }}
            className="btn-primary text-xs py-2 px-3.5"
          >
            <Plus size={15} />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Filter Tray */}
      {showFilters && (
        <div className="card p-4 bg-[#111724] border-[#222e46] animate-slide-up">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1a2336]">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Filter Ledger Entries
            </span>
            <button
              onClick={() => setShowFilters(false)}
              className="text-slate-500 hover:text-slate-300"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="form-label">Transaction Type</label>
              <select
                className="form-input text-xs"
                value={localFilters.type}
                onChange={e => setLocalFilters(p => ({ ...p, type: e.target.value }))}
              >
                <option value="">All Transactions</option>
                <option value="INCOME">Income (+)</option>
                <option value="EXPENSE">Expense (-)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Category</label>
              <select
                className="form-input text-xs"
                value={localFilters.categoryId}
                onChange={e => setLocalFilters(p => ({ ...p, categoryId: e.target.value }))}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-input text-xs font-mono"
                value={localFilters.startDate}
                onChange={e => setLocalFilters(p => ({ ...p, startDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-input text-xs font-mono"
                value={localFilters.endDate}
                onChange={e => setLocalFilters(p => ({ ...p, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#1a2336]">
            <button
              onClick={clearFilters}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="btn-primary text-xs py-1.5 px-4"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {/* Main Ledger Table Card */}
      <div className="card overflow-hidden">
        {loading.transactions ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="spinner w-6 h-6 text-emerald-400" />
            <p className="text-xs text-slate-500 font-mono">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12">
            <EmptyState
              type="transactions"
              onAction={() => setShowAddModal(true)}
              actionLabel="Add First Entry"
            />
          </div>
        ) : (
          <>
            {/* Desktop Ledger Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#1a2336] bg-[#0e131d]/60">
                    <th className="table-header">Date</th>
                    <th className="table-header">Description & Notes</th>
                    <th className="table-header">Category</th>
                    <th className="table-header">Type</th>
                    <th className="table-header text-right">Amount (₹)</th>
                    <th className="table-header text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182133]">
                  {transactions.map(tx => {
                    const isIncome = tx.type === 'INCOME'
                    return (
                      <tr key={tx.id} className="table-row">
                        {/* Date */}
                        <td className="table-cell whitespace-nowrap font-mono text-xs text-slate-400">
                          {formatDate(tx.date)}
                        </td>

                        {/* Description & Note */}
                        <td className="table-cell">
                          <p className="font-medium text-slate-200 text-xs truncate max-w-sm">
                            {tx.description || tx.category?.name || 'General Transaction'}
                          </p>
                          {tx.notes && (
                            <p className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                              {tx.notes}
                            </p>
                          )}
                        </td>

                        {/* Category badge */}
                        <td className="table-cell">
                          {tx.category ? (
                            <span
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border"
                              style={{
                                backgroundColor: `${tx.category.color}15`,
                                borderColor: `${tx.category.color}35`,
                                color: tx.category.color
                              }}
                            >
                              <span>{tx.category.icon}</span>
                              <span>{tx.category.name}</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs font-mono">Uncategorized</span>
                          )}
                        </td>

                        {/* Type indicator */}
                        <td className="table-cell">
                          <span className={isIncome ? 'badge-income' : 'badge-expense'}>
                            {isIncome ? (
                              <ArrowUpRight size={11} className="inline mr-0.5" />
                            ) : (
                              <ArrowDownRight size={11} className="inline mr-0.5" />
                            )}
                            {tx.type}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className={`table-cell text-right font-mono font-semibold text-xs tracking-tight ${isIncome ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>

                        {/* Actions */}
                        <td className="table-cell text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEdit(tx)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#1a2336] transition-colors"
                              title="Edit transaction"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              disabled={deletingId === tx.id}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete transaction"
                            >
                              {deletingId === tx.id ? (
                                <div className="spinner w-3 h-3 text-rose-400" />
                              ) : (
                                <Trash2 size={13} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Ledger List View */}
            <div className="md:hidden divide-y divide-[#182133]">
              {transactions.map(tx => {
                const isIncome = tx.type === 'INCOME'
                return (
                  <div key={tx.id} className="p-3.5 flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 border"
                      style={{
                        backgroundColor: `${tx.category?.color || '#3b82f6'}15`,
                        borderColor: `${tx.category?.color || '#3b82f6'}30`
                      }}
                    >
                      {tx.category?.icon || '💳'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">
                            {tx.description || tx.category?.name || 'Transaction'}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {formatDate(tx.date)} • {tx.category?.name || 'General'}
                          </p>
                        </div>
                        <span className={`text-xs font-mono font-bold whitespace-nowrap ${isIncome ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(tx)}
                        className="p-1.5 text-slate-400 hover:text-slate-200"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#1a2336] bg-[#0e131d]/40">
                <p className="text-xs text-slate-500 font-mono">
                  Page {pagination.page + 1} of {pagination.totalPages}
                  <span className="hidden sm:inline"> ({pagination.totalElements} total)</span>
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.first}
                    className="btn-secondary text-xs py-1.5 px-2.5 disabled:opacity-40"
                  >
                    <ChevronLeft size={13} />
                    <span>Prev</span>
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.last}
                    className="btn-secondary text-xs py-1.5 px-2.5 disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditTransaction(null) }}
        transaction={editTransaction}
      />
    </div>
  )
}

export default TransactionsPage
