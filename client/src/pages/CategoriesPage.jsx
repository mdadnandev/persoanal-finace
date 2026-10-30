import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import Modal from '../components/common/Modal'
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

const ICON_OPTIONS = ['💼', '🍽️', '🚗', '🛍️', '🏠', '⚡', '🏥', '🎬', '📚', '🏦', '💻', '📈', '🎁', '📦', '💰', '✈️', '🎮', '☕', '🐶', '💊']
const COLOR_OPTIONS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#14b8a6', '#f43f5e', '#6366f1', '#84cc16']

const CategoriesPage = () => {
  const { categories, loading, createCategory, deleteCategory } = useFinance()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'EXPENSE', icon: '📦', color: '#3b82f6' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [filterType, setFilterType] = useState('ALL')

  const incomeCategories = categories.filter(c => c.type === 'INCOME')
  const expenseCategories = categories.filter(c => c.type === 'EXPENSE')
  const displayed = filterType === 'ALL' ? categories : categories.filter(c => c.type === filterType)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Category name is required'
    return errs
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    try {
      await createCategory(form)
      setShowModal(false)
      setForm({ name: '', type: 'EXPENSE', icon: '📦', color: '#3b82f6' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#182133]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="page-title">Ledger Categories</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#161d2d] border border-[#222c42] text-slate-400">
              {categories.length} total
            </span>
          </div>
          <p className="page-subtitle">Organize and tag cash inflows and debits</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary text-xs py-2 px-3.5 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Category</span>
        </button>
      </div>

      {/* Segmented Filter Bar */}
      <div className="inline-flex rounded-lg bg-[#0e131d] p-1 border border-[#1a2336]">
        {[
          { id: 'ALL', label: `All (${categories.length})` },
          { id: 'INCOME', label: `Inflow (${incomeCategories.length})` },
          { id: 'EXPENSE', label: `Outflow (${expenseCategories.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filterType === tab.id
                ? 'bg-[#182133] text-emerald-400 border border-[#232f48] shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {displayed.map(cat => {
          const isIncome = cat.type === 'INCOME'
          return (
            <div
              key={cat.id}
              className="card-hover p-4 flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 border"
                  style={{
                    backgroundColor: `${cat.color}15`,
                    borderColor: `${cat.color}35`,
                  }}
                >
                  {cat.icon}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                    {cat.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px]">
                    <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>
                      {isIncome ? '↑ Inflow' : '↓ Outflow'}
                    </span>
                    {cat.isDefault && (
                      <span className="px-1.5 py-0.2 rounded bg-[#161f30] text-slate-400 border border-[#222c42] text-[10px]">
                        system
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!cat.isDefault && (
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-80 group-hover:opacity-100"
                  title="Delete category"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Create Category Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Ledger Category">
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Category Type */}
          <div>
            <label className="form-label">Classification</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, type: 'EXPENSE' }))}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  form.type === 'EXPENSE'
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 font-semibold'
                    : 'bg-[#0e131d] border-[#1e2638] text-slate-400 hover:text-slate-200'
                }`}
              >
                ↓ Outflow (Expense)
              </button>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, type: 'INCOME' }))}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  form.type === 'INCOME'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                    : 'bg-[#0e131d] border-[#1e2638] text-slate-400 hover:text-slate-200'
                }`}
              >
                ↑ Inflow (Income)
              </button>
            </div>
          </div>

          {/* Category Name */}
          <div>
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className={`form-input text-xs ${errors.name ? 'border-rose-500/70' : ''}`}
              placeholder="e.g. Subscriptions, Groceries, Cloud Hosting"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
            {errors.name && <p className="text-rose-400 text-xs mt-1 font-mono">{errors.name}</p>}
          </div>

          {/* Icon Selection */}
          <div>
            <label className="form-label">Icon Symbol</label>
            <div className="grid grid-cols-10 gap-1.5 p-2 rounded-lg bg-[#0e131d] border border-[#1e2638]">
              {ICON_OPTIONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, icon }))}
                  className={`w-7 h-7 rounded-md text-base flex items-center justify-center transition-all ${
                    form.icon === icon
                      ? 'bg-[#1e2638] ring-1 ring-emerald-400 scale-105'
                      : 'hover:bg-[#151c2a]'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="form-label">Color Swatch</label>
            <div className="flex gap-2 flex-wrap p-2 rounded-lg bg-[#0e131d] border border-[#1e2638]">
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, color }))}
                  className={`w-6 h-6 rounded-md transition-all ${
                    form.color === color
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0e131d] scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 rounded-lg bg-[#0e131d] border border-[#1e2638] flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-base border"
              style={{
                backgroundColor: `${form.color}20`,
                borderColor: `${form.color}40`,
              }}
            >
              {form.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {form.name || 'Sample Category'}
              </p>
              <p className={`text-[11px] font-mono ${form.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {form.type === 'INCOME' ? 'Inflow Source' : 'Outflow Category'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e2638]">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-secondary text-xs py-2 px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-xs py-2 px-4"
            >
              {submitting ? <span className="spinner" /> : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default CategoriesPage
