import { useState, useEffect } from 'react'
import { useFinance } from '../../context/FinanceContext'
import Modal from '../common/Modal'
import { Plus, Save, ArrowUpRight, ArrowDownRight } from 'lucide-react'
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
        amount: '',
        type: 'EXPENSE',
        categoryId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
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
      title={isEdit ? 'Modify Ledger Entry' : 'Record New Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Segmented Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#0e131d] border border-[#1e2638]">
          <button
            type="button"
            onClick={() => setForm(p => ({ ...p, type: 'EXPENSE', categoryId: '' }))}
            className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              form.type === 'EXPENSE'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownRight size={14} />
            <span>Outflow (Expense)</span>
          </button>
          <button
            type="button"
            onClick={() => setForm(p => ({ ...p, type: 'INCOME', categoryId: '' }))}
            className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              form.type === 'INCOME'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight size={14} />
            <span>Inflow (Income)</span>
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="form-label">Amount</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-medium text-base">
              ₹
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              autoFocus
              className={`form-input pl-8 text-base font-mono font-bold tracking-tight text-slate-100 ${
                errors.amount ? 'border-rose-500/70' : ''
              }`}
              placeholder="0.00"
              value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
            />
          </div>
          {errors.amount && <p className="text-rose-400 text-xs mt-1 font-mono">{errors.amount}</p>}
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="form-label">Category</label>
          <select
            className="form-input text-xs"
            value={form.categoryId}
            onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
          >
            <option value="">Select Category (Optional)</option>
            {filteredCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="form-label">Description / Payee</label>
          <input
            type="text"
            className="form-input text-xs"
            placeholder="e.g. AWS Cloud Services, Salary, Blue Tokai Coffee"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            maxLength={100}
          />
        </div>

        {/* Date Input */}
        <div>
          <label className="form-label">Booking Date</label>
          <input
            type="date"
            className={`form-input text-xs font-mono ${errors.date ? 'border-rose-500/70' : ''}`}
            value={form.date}
            onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
          />
          {errors.date && <p className="text-rose-400 text-xs mt-1 font-mono">{errors.date}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="form-label">
            Internal Note <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            className="form-input text-xs"
            placeholder="Invoice reference, reimbursement tag, etc."
            value={form.notes}
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            maxLength={100}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1c263c]">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs py-2 px-3.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-xs py-2 px-4"
          >
            {loading ? (
              <span className="spinner" />
            ) : isEdit ? (
              <>
                <Save size={14} />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Record Entry</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default TransactionModal
