import { useState, useEffect } from 'react'
import { useFinance } from '../../context/FinanceContext'
import Modal from '../common/Modal'
import { Plus, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const TransactionModal = ({ isOpen, onClose, transaction }) => {
  const { categories, createTransaction, updateTransaction } = useFinance()
  const isEdit = !!transaction

  const [form, setForm] = useState({
    amount: '',
    type: 'EXPENSE',
    categoryId: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (transaction) {
      setForm({
        amount: transaction.amount?.toString() || '',
        type: transaction.type || 'EXPENSE',
        categoryId: transaction.category?.id?.toString() || '',
        description: transaction.description || '',
        date: transaction.date || new Date().toISOString().split('T')[0],
        notes: transaction.notes || '',
      })
    } else {
      setForm({
        amount: '', type: 'EXPENSE', categoryId: '',
        description: '', date: new Date().toISOString().split('T')[0], notes: '',
      })
    }
    setErrors({})
  }, [transaction, isOpen])

  const filteredCategories = categories.filter(c => c.type === form.type)

  const validate = () => {
    const errs = {}
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0'
    }
    if (!form.date) errs.date = 'Date is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const payload = {
        amount: parseFloat(form.amount),
        type: form.type,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        description: form.description || null,
        date: form.date,
        notes: form.notes || null,
      }

      if (isEdit) {
        await updateTransaction(transaction.id, payload)
      } else {
        await createTransaction(payload)
      }
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2">
          {['INCOME', 'EXPENSE'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setForm(p => ({ ...p, type: t, categoryId: '' }))}
              className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
                ${form.type === t
                  ? t === 'INCOME'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/50'
                    : 'bg-red-500/15 text-red-400 border-red-500/50'
                  : 'bg-slate-800/50 text-slate-500 border-slate-700 hover:border-slate-600'}`}
            >
              {t === 'INCOME' ? '↑ Income' : '↓ Expense'}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="form-label">Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
            <input
              type="number" step="0.01" min="0.01"
              className={`form-input pl-8 ${errors.amount ? 'border-red-500/70' : ''}`}
              placeholder="0.00"
              value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
            />
          </div>
          {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="form-label">Category</label>
          <select
            className="form-input"
            value={form.categoryId}
            onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
          >
            <option value="">Select category (optional)</option>
            {filteredCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="form-label">Description</label>
          <input
            type="text" className="form-input"
            placeholder="What was this for?"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            maxLength={100}
          />
        </div>

        {/* Date */}
        <div>
          <label className="form-label">Date</label>
          <input
            type="date"
            className={`form-input ${errors.date ? 'border-red-500/70' : ''}`}
            value={form.date}
            onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
          />
          {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="form-label">Notes <span className="text-slate-500 font-normal">(optional)</span></label>
          <input
            type="text" className="form-input"
            placeholder="Any additional notes..."
            value={form.notes}
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            maxLength={100}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <span className="spinner" /> : isEdit ? <><Save size={16} /> Update</> : <><Plus size={16} /> Add</>}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default TransactionModal
