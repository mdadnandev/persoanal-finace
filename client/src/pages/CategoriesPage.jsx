import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import Modal from '../components/common/Modal'
import { Plus, Trash2, Tags } from 'lucide-react'
import toast from 'react-hot-toast'

const ICON_OPTIONS = ['💼', '🍽️', '🚗', '🛍️', '🏠', '⚡', '🏥', '🎬', '📚', '🏦', '💻', '📈', '🎁', '📦', '💰', '✈️', '🎮', '☕', '🐶', '💊']
const COLOR_OPTIONS = ['#6366f1', '#22c55e', '#ef4444', '#f97316', '#ec4899', '#14b8a6', '#eab308', '#3b82f6', '#8b5cf6', '#06b6d4']

const CategoriesPage = () => {
  const { categories, loading, createCategory, deleteCategory } = useFinance()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'EXPENSE', icon: '📦', color: '#6366f1' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [filterType, setFilterType] = useState('ALL')

  const incomeCategories = categories.filter(c => c.type === 'INCOME')
  const expenseCategories = categories.filter(c => c.type === 'EXPENSE')
  const displayed = filterType === 'ALL' ? categories : categories.filter(c => c.type === filterType)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
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
      setForm({ name: '', type: 'EXPENSE', icon: '📦', color: '#6366f1' })
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
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">{categories.length} categories · {incomeCategories.length} income · {expenseCategories.length} expense</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2">
        {['ALL', 'INCOME', 'EXPENSE'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all
              ${filterType === t
                ? t === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : t === 'EXPENSE' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}
          >
            {t === 'ALL' ? 'All' : t === 'INCOME' ? '↑ Income' : '↓ Expense'}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayed.map(cat => (
          <div key={cat.id} className="glass-card-hover p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${cat.color}22` }}>
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-200 truncate">{cat.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs ${cat.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {cat.type === 'INCOME' ? '↑ Income' : '↓ Expense'}
                </span>
                {cat.isDefault && (
                  <span className="text-xs text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">default</span>
                )}
              </div>
            </div>
            {!cat.isDefault && (
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create Category Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Category">
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Name */}
          <div>
            <label className="form-label">Category Name</label>
            <input
              type="text" className={`form-input ${errors.name ? 'border-red-500/70' : ''}`}
              placeholder="e.g. Netflix, Gym..."
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="form-label">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['INCOME', 'EXPENSE'].map(t => (
                <button key={t} type="button"
                  onClick={() => setForm(p => ({ ...p, type: t }))}
                  className={`p-2.5 rounded-xl text-sm font-medium border transition-all
                    ${form.type === t
                      ? t === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
                >
                  {t === 'INCOME' ? '↑ Income' : '↓ Expense'}
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="form-label">Icon</label>
            <div className="grid grid-cols-10 gap-1.5">
              {ICON_OPTIONS.map(icon => (
                <button key={icon} type="button"
                  onClick={() => setForm(p => ({ ...p, icon }))}
                  className={`w-8 h-8 rounded-lg text-lg hover:bg-slate-700 transition-all flex items-center justify-center
                    ${form.icon === icon ? 'bg-slate-600 ring-2 ring-primary-500' : 'bg-slate-800'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="form-label">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map(color => (
                <button key={color} type="button"
                  onClick={() => setForm(p => ({ ...p, color }))}
                  className={`w-7 h-7 rounded-lg transition-all ${form.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : ''}`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: `${form.color}22` }}>
              {form.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">{form.name || 'Category Name'}</p>
              <p className={`text-xs ${form.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>{form.type}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <span className="spinner" /> : <><Plus size={16} /> Create</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default CategoriesPage
